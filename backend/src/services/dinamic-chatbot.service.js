import { prisma } from '../libs/prisma.lib.js';

// Normaliza texto: minúsculas, sin acentos, sin caracteres especiales
function normalize(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9\s]/gi, '') // Solo letras, números y espacios
        .trim();
}

// Extrae entidades (proceso/categoría) del mensaje, dinámicamente
function extractEntities(msg, processes, categories) {
    const cleanMsg = normalize(msg);
    let proceso = null, categoria = null;

    // Busca el proceso más largo primero para evitar coincidencias parciales (ej. "Servicio" en "Servicio Social")
    const sortedProcesses = [...processes].sort((a, b) => b.norm.length - a.norm.length);
    for (const p of sortedProcesses) {
        // Mejorar la detección de procesos: si el mensaje CONTIENE el nombre normalizado del proceso
        // O si el mensaje contiene "practicas" y el proceso es "Prácticas Profesionales"
        if (cleanMsg.includes(p.norm) || (p.name === 'Prácticas Profesionales' && cleanMsg.includes('practicas'))) {
            proceso = p;
            break; // Una vez que encontramos un proceso, lo usamos.
        }
    }

    // Busca la categoría más larga primero y con coincidencia INCLUIDA
    const sortedCategories = [...categories].sort((a, b) => b.norm.length - a.norm.length);
    for (const c of sortedCategories) {
        // Mejorar la detección de categorías: si el mensaje CONTIENE el nombre normalizado de la categoría
        if (cleanMsg.includes(c.norm)) {
            categoria = c;
            break;
        }
    }

    // Heurística para "requisitos"
    if (!categoria && (cleanMsg.includes('requisitos') || cleanMsg.includes('cuales son') || cleanMsg.includes('que pide'))) {
        const requisitosCat = categories.find(c => c.norm === normalize('requisitos'));
        if (requisitosCat) {
            categoria = requisitosCat;
        }
    }

    // Heurística para "qué es/son" o solo el nombre del proceso
    if (proceso && !categoria && (cleanMsg.includes('que es') || cleanMsg.includes('que son') || cleanMsg === proceso.norm)) {
        const infoGeneralCat = categories.find(c => c.norm === normalize('informacion general')); // Asume que tienes una categoría llamada "Información general"
        if (infoGeneralCat) {
            categoria = infoGeneralCat;
        }
    }

    // --- NUEVA HEURÍSTICA: Detección de categorías por palabras clave o subcadenas ---
    // Esto es para casos como "seguimiento" que deberían mapear a "Seguimiento y entrega de reporte"
    if (!categoria && proceso) { // Solo si ya tenemos un proceso identificado
        if (cleanMsg.includes('seguimiento') || cleanMsg.includes('reporte')) {
            const seguimientoCat = categories.find(c => c.norm.includes(normalize('seguimiento y entrega de reporte')));
            if (seguimientoCat) {
                categoria = seguimientoCat;
            }
        }
        // Puedes añadir más casos aquí si tienes otras categorías con nombres largos
        // Ej: if (cleanMsg.includes('documentos')) { const docCat = categories.find(c => c.norm.includes(normalize('documentos necesarios'))); if (docCat) { categoria = docCat; } }
    }
    // --------------------------------------------------------------------------------

    return { proceso, categoria };
}

// Extrae todas las entidades mencionadas en el mensaje (para preguntas compuestas)
function extractAllEntities(msg, processes, categories) {
    const cleanMsg = normalize(msg);
    const foundProcesses = processes.filter(p => cleanMsg.includes(p.norm));
    const foundCategories = categories.filter(c => cleanMsg.includes(c.norm));
    return { foundProcesses, foundCategories };
}

// Busca entidades (solo proceso) en el historial si el mensaje actual es ambiguo
function inferFromHistory(history, processes) {
    if (!Array.isArray(history)) return null;
    for (let i = history.length - 1; i >= 0; i--) {
        const h = history[i]?.message || '';
        const { proceso } = extractEntities(h, processes, []);
        if (proceso) return proceso;
    }
    return null;
}

// Determina si el mensaje es una pregunta directa sobre la entidad (ej. "servicio social" o "que es servicio social")
function isDirectEntityQuery(msg, entity) {
    if (!entity) return false;
    const normMsg = normalize(msg);
    const normEntity = normalize(entity.name);

    return normMsg === normEntity ||
           normMsg === `que es ${normEntity}` ||
           normMsg === `que son ${normEntity}` ||
           normMsg === `que requisitos ${normEntity}` ||
           (normMsg.includes(normEntity) && (normMsg.includes('cuales') || normMsg.includes('son') || normMsg.includes('los')));
}

// Busca la mejor respuesta posible de forma dinámica
async function findBestResponse({ proceso, categoria, faqs, processes, categories, userMessage, inferredProcesoFromHistory }) {

    let targetProceso = proceso; // Siempre priorizamos el proceso del mensaje actual
    let targetCategoria = categoria; // Siempre priorizamos la categoria del mensaje actual

    // PRIORIDAD 1: Buscar una FAQ específica si se detectan ambos (proceso y categoría) en el MENSAJE ACTUAL.
    // Esta es la prioridad MÁS ALTA para un cambio de contexto directo.
    if (proceso && categoria) { // Usamos 'proceso' y 'categoria' directamente del mensaje actual
        const faq = faqs.find(f => f.processId === proceso.id && f.categoryId === categoria.id);
        if (faq && faq.response) {
            return { response: faq.response, source: `${proceso.name} / ${categoria.name}` };
        }
    }

    // Si el mensaje actual no tiene un proceso claro, pero sí hay uno inferido del historial,
    // y no hay una FAQ directa con la categoría actual y el proceso actual.
    // Intentamos buscar una FAQ con el proceso del historial y la categoría actual.
    if (!targetProceso && inferredProcesoFromHistory) {
        // Primero, intentamos una combinación de la categoría del mensaje actual y el proceso del historial
        if (targetCategoria) {
            const faqWithInferredProcess = faqs.find(f => f.processId === inferredProcesoFromHistory.id && f.categoryId === targetCategoria.id);
            if (faqWithInferredProcess && faqWithInferredProcess.response) {
                return { response: faqWithInferredProcess.response, source: `${inferredProcesoFromHistory.name} / ${targetCategoria.name}` };
            }
        }
        // Si no hay categoría, o la combinación no funcionó, entonces el proceso del historial es el target
        targetProceso = inferredProcesoFromHistory;
    }

    // Las siguientes prioridades usan `targetProceso` y `targetCategoria` que ahora pueden provenir del historial
    // si no se detectaron fuertemente en el mensaje actual.

    // PRIORIDAD 2: Si la pregunta es directa y solo sobre un proceso (del mensaje actual)
    // Se comenta porque la nueva heurística de "qué es/son" en extractEntities ya lo manejaría mejor
    /*
    if (proceso && isDirectEntityQuery(userMessage, proceso)) {
        return { response: proceso.description || `Aquí tienes información general sobre ${proceso.name}.`, source: `Proceso: ${proceso.name}` };
    }
    */

    // PRIORIDAD 3: Si la pregunta es directa y solo sobre una categoría (del mensaje actual)
    if (categoria && isDirectEntityQuery(userMessage, categoria)) {
        return { response: categoria.description || `Aquí tienes información general sobre la categoría: ${categoria.name}.`, source: `Categoría: ${categoria.name}` };
    }

    // PRIORIDAD 4: Si se detecta un proceso (del mensaje o historial) pero NO una categoría específica, sugiere categorías.
    if (targetProceso && !targetCategoria) {
        const relatedFaqs = faqs.filter(f => f.processId === targetProceso.id);
        if (relatedFaqs.length > 0) {
            const uniqueCategories = [...new Set(relatedFaqs.map(f => f.categoryId))]
                .map(catId => categories.find(c => c.id === catId))
                .filter(Boolean);
            if (uniqueCategories.length > 0) {
                const categoryList = `<ul>${uniqueCategories.map(c => `<li>${c.name}</li>`).join('')}</ul>`;
                return {
                    response: `Sobre el proceso de <b>${targetProceso.name}</b>, tengo información en las siguientes categorías:${categoryList}<br>¿Cuál te interesa?`,
                    source: `Sugerencia de categorías para ${targetProceso.name}`
                };
            }
        }
        // Si no hay FAQs relacionadas, pero sí descripción del proceso
        if (targetProceso.description) {
            return { response: targetProceso.description, source: `Proceso: ${targetProceso.name}` };
        }
    }

    // PRIORIDAD 5: Si se detecta una categoría (del mensaje actual) pero NO un proceso específico, sugiere procesos.
    if (targetCategoria && !targetProceso) { // Usamos targetCategoria aquí
        const relatedFaqs = faqs.filter(f => f.categoryId === targetCategoria.id);
        if (relatedFaqs.length > 0) {
            const uniqueProcesses = [...new Set(relatedFaqs.map(f => f.processId))]
                .map(procId => processes.find(p => p.id === procId))
                .filter(Boolean);
            if (uniqueProcesses.length > 0) {
                const processList = `<ul>${uniqueProcesses.map(p => `<li>${p.name}</li>`).join('')}</ul>`;
                return {
                    response: `La categoría <b>${targetCategoria.name}</b> aplica a los siguientes procesos:${processList}<br>¿De cuál te gustaría saber?`,
                    source: `Sugerencia de procesos para ${targetCategoria.name}`
                };
            }
        }
        // Si no hay FAQs relacionadas, pero sí descripción de la categoría
        if (targetCategoria.description) {
            return { response: targetCategoria.description, source: `Categoría: ${categoria.name}` };
        }
    }

    // Si no se detecta nada relevante o la combinación no tiene FAQ
    if (proceso || categoria || inferredProcesoFromHistory) {
        const entityInQuestion = (proceso || inferredProcesoFromHistory)?.name || categoria?.name;
        return {
            response: `No encontré una respuesta específica para tu pregunta sobre "${entityInQuestion}". ¿Podrías ser más específico?`,
            source: null
        };
    }

    return null;
}

// Nueva función: responde a preguntas sobre múltiples procesos/categorías
async function findBestMultiResponse({ processes, categories, faqs, userMessage }) {
    const { foundProcesses, foundCategories } = extractAllEntities(userMessage, processes, categories);
    const normUserMessage = normalize(userMessage);

    // Si el usuario pregunta "ambas" o "ambos" y hay solo dos procesos en total, inferir ambos.
    if (/(ambas|ambos)/.test(normUserMessage) && foundProcesses.length === 0 && processes.length === 2) {
        foundProcesses.push(...processes);
    }

    if (foundProcesses.length + foundCategories.length > 1) {
        const responses = [];
        for (const proc of foundProcesses) {
            responses.push(`<h4>${proc.name}</h4><div>${proc.description || `Aquí tienes información general sobre ${proc.name}.`}</div>`);
        }
        for (const cat of foundCategories) {
            responses.push(`<h4>${cat.name}</h4><div>${cat.description || `Aquí tienes información general sobre la categoría: ${cat.name}.`}</div>`);
        }
        if (responses.length > 0) {
            return {
                response: responses.join('<hr>'),
                source: 'Múltiples entidades detectadas',
                score: 10,
                needsMoreContext: false
            };
        }
    }
    return null;
}

export class DinamicChatbotService {
    /**
     * Intérprete IA: responde dinámicamente según la BD y seed, usando historial si es necesario.
     */
    static async getResponse({ message, history = [] }) {
        if (!message || typeof message !== 'string' || message.trim().length < 2) {
            return {
                response: 'Por favor, escribe tu duda o mensaje.',
                source: null,
                score: 0,
                needsMoreContext: false
            };
        }

        // Cargar datos dinámicamente
        const [faqs, processes, categories] = await Promise.all([
            prisma.processCategory.findMany({
                where: { isActive: true },
                select: { id: true, processId: true, categoryId: true, response: true }
            }),
            prisma.process.findMany({
                where: { isActive: true },
                select: { id: true, name: true, description: true }
            }),
            prisma.category.findMany({
                where: { isActive: true },
                select: { id: true, name: true, description: true }
            })
        ]);

        // Normalizar nombres para comparación
        const processesNorm = processes.map(p => ({ ...p, norm: normalize(p.name) }));
        const categoriesNorm = categories.map(c => ({ ...c, norm: normalize(c.name) }));

        // Intento 1: Buscar si la pregunta es sobre múltiples entidades
        const multiResponse = await findBestMultiResponse({ processes: processesNorm, categories: categoriesNorm, faqs, userMessage: message });
        if (multiResponse) {
            return multiResponse;
        }

        // Intento 2: Extraer entidades del mensaje actual
        let { proceso, categoria } = extractEntities(message, processesNorm, categoriesNorm);

        // Intento 3: Si falta un proceso principal en el mensaje actual, buscarlo en el historial
        let inferredProcesoFromHistory = inferFromHistory(history, processesNorm);

        // Intento 4: Buscar la mejor respuesta específica, pasando el proceso inferido del historial
        const best = await findBestResponse({
            proceso, // Proceso detectado en el mensaje actual
            categoria, // Categoría detectada en el mensaje actual
            faqs,
            processes: processesNorm,
            categories: categoriesNorm,
            userMessage: message,
            inferredProcesoFromHistory // Proceso inferido del historial
        });

        if (best) {
            return {
                response: best.response,
                source: best.source,
                score: 10,
                needsMoreContext: false
            };
        }

        // Intento 5: Si no se encontró nada relevante pero se detectó una entidad (o se infirió un proceso), preguntar por más detalles.
        if (proceso || categoria || inferredProcesoFromHistory) {
            // Priorizamos el proceso del mensaje actual, luego el inferido, luego la categoría del mensaje actual
            const detectedEntityName = proceso?.name || inferredProcesoFromHistory?.name || categoria?.name;
            return {
                response: `Entiendo que tu pregunta está relacionada con "${detectedEntityName}". ¿Podrías ser más específico sobre lo que necesitas saber? Por ejemplo, ¿quieres información sobre requisitos, documentos, o el proceso de inscripción?`,
                source: 'Solicitud de Clarificación',
                score: 5,
                needsMoreContext: true
            };
        }

        // Respuesta por defecto si no se detecta nada
        return {
            response: 'Disculpa, no pude encontrar información relevante para tu pregunta. Por favor, intenta reformularla o sé más específico.',
            source: null,
            score: 0,
            needsMoreContext: true
        };
    }
}