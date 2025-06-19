/**
 * DinamicChatbotAI Service - Hugging Face Version
 * Usa el modelo gratuito 'HuggingFaceH4/zephyr-7b-beta' vía HuggingFace Inference API
 */

import fetch from 'node-fetch';
import { prisma } from '../libs/prisma.lib.js';

const HF_MODEL = 'HuggingFaceH4/zephyr-7b-beta';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const HF_API_KEY = process.env.HF_API_KEY;

/**
 * Obtiene la base de conocimientos activa del sistema.
 */
async function fetchKnowledgeBase() {
  const processCategories = await prisma.processCategory.findMany({
    where: { isActive: true },
    include: {
      process: { select: { name: true, description: true } },
      category: { select: { name: true, description: true } },
    },
  });

  return processCategories.map(pc => ({
    process: pc.process.name,
    processDescription: pc.process.description,
    category: pc.category.name,
    categoryDescription: pc.category.description,
    response: pc.response
  }));
}

/**
 * Genera una respuesta con Hugging Face usando un modelo gratuito.
 */
async function getAIResponse({ prompt, history = [], userId = null }) {
  const cleanPrompt = prompt?.toLowerCase().trim() || '';

  // 1. Saludos simples
  const greetings = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'qué tal', 'hey'];
  if (greetings.some(greet => cleanPrompt.includes(greet))) {
    return '<p>¡Hola! ¿En qué puedo ayudarte con respecto a los <b>procesos universitarios</b>?</p>';
  }

  // 2. Obtener base de conocimientos
  const context = await fetchKnowledgeBase();

    // 3. Buscar coincidencia aproximada también en la respuesta
    const looseMatch = context.find(d =>
    d.response.toLowerCase().includes(cleanPrompt) ||
    cleanPrompt.includes(d.process.toLowerCase()) ||
    cleanPrompt.includes(d.category.toLowerCase())
    );

    if (looseMatch) {
    const pc = await prisma.processCategory.findFirst({
        where: {
        process: { name: looseMatch.process },
        category: { name: looseMatch.category },
        isActive: true
        }
    });

    if (pc) {
        await prisma.processCategoryLog.create({
        data: {
            processCategoryId: pc.id,
            userId: userId || null,
            actionTypeId: 5
        }
        });

        return looseMatch.response;
    }
    }

  // 4. Si hay coincidencia con una FAQ (process + category), responder directamente con la respuesta oficial
  if (looseMatch) {
    const pc = await prisma.processCategory.findFirst({
      where: {
        process: { name: match.process },
        category: { name: match.category },
        isActive: true
      }
    });

    if (pc) {
      await prisma.processCategoryLog.create({
        data: {
          processCategoryId: pc.id,
          userId: userId || null,
          actionTypeId: 5 // Consulta
        }
      });

      return match.response; // Ya está en HTML
    }
  }

  // 5. Si no hay coincidencia exacta, llama a la IA (Zephyr)
  const contextText = context.map(d =>
    `Proceso: ${d.process}\nCategoría: ${d.category}\nRespuesta: ${d.response}`
  ).join('\n---\n').slice(0, 1800);

  const lastUserMessage = history.filter(h => h.role === 'user').slice(-1)[0]?.message || prompt;

  const fullPrompt = `Eres un asistente universitario experto en procesos y trámites. Responde SIEMPRE en español y utiliza la siguiente base de conocimientos para responder. Si no conoces la respuesta, responde con "Lo siento, no tengo información sobre eso en este momento." Usa etiquetas HTML (<p>, <br>, <b>, <i>, <ol>, <ul>) si es apropiado.

Base de conocimientos:
${contextText}

Pregunta del usuario: ${lastUserMessage}
Respuesta:`.trim();

  const body = {
    inputs: fullPrompt,
    parameters: { max_new_tokens: 180, temperature: 0.7 },
    options: { wait_for_model: true }
  };

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text();
      if ([401, 403].includes(response.status)) return '[API key inválida o sin permisos.]';
      if (response.status === 429) return '[Límite de uso alcanzado. Intenta más tarde.]';
      return `[Error (${response.status}): ${text}]`;
    }

    const data = await response.json();
    const rawText = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : data.generated_text || '';

    let cleanedText = rawText.replace(fullPrompt, '').trim();
    if (!cleanedText || cleanedText.length < 20 || /no tengo información|no sé|no conozco/i.test(cleanedText)) {
    return '<p>Lo siento, no tengo información sobre eso en este momento.</p>';
    }
    return plainTextToHtml(cleanedText);
  } catch (err) {
    console.error('[ERROR] Fallo al llamar a HuggingFace:', err);
    return '[El servicio de IA no está disponible por el momento.]';
  }
}


// Conversión simple de texto a HTML con <p>, <br>, <ol>, <ul>, etc.
function plainTextToHtml(text) {
  if (!text) return '';
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/(?:^|\n)(\d+\. .+(?:\n\d+\. .+)*)/g, match => {
      const items = match.trim().split(/\n/).map(line => line.replace(/^\d+\.\s*/, ''));
      return '<ol>' + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
    })
    .replace(/(?:^|\n)([-*] .+(?:\n[-*] .+)*)/g, match => {
      const items = match.trim().split(/\n/).map(line => line.replace(/^[-*]\s*/, ''));
      return '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
    })
    .replace(/\n/g, '<br>')
    .replace(/(<br>){2,}/g, '</p><p>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/p>/g, '');
  return html;
}

export default {
  getAIResponse
};