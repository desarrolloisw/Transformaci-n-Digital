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

    // Detección de categorías por palabras clave o subcadenas (ej. "seguimiento" para "Seguimiento y entrega de reporte")
    if (!categoria && proceso) {
        if (cleanMsg.includes('seguimiento') || cleanMsg.includes('reporte')) {
            const seguimientoCat = categories.find(c => c.norm.includes(normalize('seguimiento y entrega de reporte')));
            if (seguimientoCat) {
                categoria = seguimientoCat;
            }
        }
    }

    return { proceso, categoria };
}

// Extrae todas las entidades mencionadas en el mensaje (para preguntas compuestas)
// Ahora simplemente encuentra todas las coincidencias sin lógica compleja de agrupación aquí.
function extractAllEntities(msg, processes, categories) {
    const cleanMsg = normalize(msg);
    const foundProcesses = processes.filter(p => cleanMsg.includes(p.norm));
    const foundCategories = categories.filter(c => cleanMsg.includes(c.norm));
    return { foundProcesses, foundCategories };
}

// Busca entidades (solo proceso) y la última categoría preguntada en el historial
function inferFromHistory(history, processes, categories) {
    let inferredProceso = null;
    let lastCategoriaName = null;

    if (!Array.isArray(history)) return { proceso: null, lastCategoriaName: null };

    for (let i = history.length - 1; i >= 0; i--) {
        const h = history[i]?.message || '';
        const { proceso: pHist, categoria: cHist } = extractEntities(h, processes, categories);

        if (pHist && !inferredProceso) { // Obtener el proceso más reciente del historial
            inferredProceso = pHist;
        }
        if (cHist && !lastCategoriaName) { // Obtener la categoría más reciente del historial
            lastCategoriaName = cHist.name;
        }

        // Si ya encontramos ambos, podemos parar
        if (inferredProceso && lastCategoriaName) break;
    }
    return { proceso: inferredProceso, lastCategoriaName: lastCategoriaName };
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
async function findBestResponse({ proceso, categoria, faqs, processes, categories, userMessage, inferredProcesoFromHistory, lastCategoriaNameFromHistory }) {

    let targetProceso = proceso; // Siempre priorizamos el proceso del mensaje actual
    let targetCategoria = categoria; // Siempre priorizamos la categoria del mensaje actual

    // --- NUEVA PRIORIDAD: Si se menciona un nuevo proceso y se tiene una categoría reciente del historial ---
    // Esto maneja "y en las prácticas profesionales?" después de preguntar "requisitos"
    if (proceso && !categoria && lastCategoriaNameFromHistory) {
        // Intentar encontrar la categoría del historial en la lista de categorías
        const lastCatObj = categories.find(c => normalize(c.name) === normalize(lastCategoriaNameFromHistory));
        if (lastCatObj) {
            const faqWithPreviousCategory = faqs.find(f => f.processId === proceso.id && f.categoryId === lastCatObj.id);
            if (faqWithPreviousCategory && faqWithPreviousCategory.response) {
                return { response: faqWithPreviousCategory.response, source: `${proceso.name} / ${lastCatObj.name} (inferido)`, processCategoryId: faqWithPreviousCategory.id };
            }
        }
    }

    // PRIORIDAD 1: Buscar una FAQ específica si se detectan ambos (proceso y categoría) en el MENSAJE ACTUAL.
    // Esta es la prioridad MÁS ALTA para un cambio de contexto directo.
    if (proceso && categoria) {
        const faq = faqs.find(f => f.processId === proceso.id && f.categoryId === categoria.id);
        if (faq && faq.response) {
            return { response: faq.response, source: `${proceso.name} / ${categoria.name}`, processCategoryId: faq.id };
        }
    }

    // Si el mensaje actual no tiene un proceso claro, pero sí hay uno inferido del historial,
    // y no hay una FAQ directa con la categoría actual y el proceso actual.
    // Intentamos buscar una FAQ con el proceso del historial y la categoría actual.
    if (!targetProceso && inferredProcesoFromHistory) {
        if (targetCategoria) {
            const faqWithInferredProcess = faqs.find(f => f.processId === inferredProcesoFromHistory.id && f.categoryId === targetCategoria.id);
            if (faqWithInferredProcess && faqWithInferredProcess.response) {
                return { response: faqWithInferredProcess.response, source: `${inferredProcesoFromHistory.name} / ${targetCategoria.name}`, processCategoryId: faqWithInferredProcess.id };
            }
        }
        targetProceso = inferredProcesoFromHistory;
    }

    // PRIORIDAD 2: Si la pregunta es directa y solo sobre una categoría (del mensaje actual)
    if (categoria && isDirectEntityQuery(userMessage, categoria)) {
        // No hay processCategoryId específico aquí, ya que no es una FAQ proceso-categoría
        return { response: categoria.description || `Aquí tienes información general sobre la categoría: ${categoria.name}.`, source: `Categoría: ${categoria.name}` };
    }

    // PRIORIDAD 3: Si se detecta un proceso (del mensaje o historial) pero NO una categoría específica, sugiere categorías.
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
        if (targetProceso.description) {
            return { response: targetProceso.description, source: `Proceso: ${targetProceso.name}` };
        }
    }

    // PRIORIDAD 4: Si se detecta una categoría (del mensaje actual) pero NO un proceso específico, sugiere procesos.
    if (targetCategoria && !targetProceso) {
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
        if (targetCategoria.description) {
            return { response: targetCategoria.description, source: `Categoría: ${categoria.name}` };
        }
    }

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
async function findBestMultiResponse({ processes, categories, faqs, userMessage, inferredProcesoFromHistory }) {
    const cleanMsg = normalize(userMessage);
    const { foundProcesses, foundCategories } = extractAllEntities(userMessage, processes, categories);
    const responses = [];
    const loggedProcessCategoryIds = []; // Para registrar IDs de FAQs usadas

    // Determinar el proceso principal: si se menciona explícitamente o se infiere del historial
    let mainProcess = foundProcesses.length === 1 ? foundProcesses[0] : null;
    if (!mainProcess && inferredProcesoFromHistory) {
        // Asegurarse de que el proceso inferido esté realmente relacionado con alguna categoría en el mensaje
        const relatedToInferred = foundCategories.some(cat =>
            faqs.some(faq => faq.processId === inferredProcesoFromHistory.id && faq.categoryId === cat.id)
        );
        if (relatedToInferred) {
            mainProcess = inferredProcesoFromHistory;
        }
    }

    // Si el usuario pregunta "ambas" o "ambos" y hay solo dos procesos en total, inferir ambos.
    if (/(ambas|ambos)/.test(cleanMsg) && foundProcesses.length === 0 && processes.length === 2) {
        foundProcesses.push(...processes);
        mainProcess = null; // Si son ambos, no hay un "mainProcess" único para agrupar
    }

    // Caso 1: Se detecta un proceso principal (del mensaje o historial) y múltiples categorías para él.
    if (mainProcess && foundCategories.length > 0) {
        for (const cat of foundCategories) {
            const faq = faqs.find(f => f.processId === mainProcess.id && f.categoryId === cat.id);
            if (faq && faq.response) {
                responses.push(`<h4>${mainProcess.name} / ${cat.name}</h4><div>${faq.response}</div>`);
                loggedProcessCategoryIds.push(faq.id);
            } else {
                // Si no hay FAQ específica, dar la descripción de la categoría (como fallback)
                responses.push(`<h4>${cat.name}</h4><div>${cat.description || `Aquí tienes información general sobre la categoría: ${cat.name}.`}</div>`);
            }
        }
        if (responses.length > 0) {
            return {
                response: responses.join('<hr>'),
                source: `Múltiples categorías para ${mainProcess.name}`,
                score: 10,
                needsMoreContext: false,
                processCategoryIds: loggedProcessCategoryIds
            };
        }
    }
    
    // Caso 2: Múltiples procesos o múltiples categorías sin un proceso principal claro.
    // O si el caso 1 no generó una respuesta completa (ej. no se encontraron FAQs para las categorías)
    if (foundProcesses.length > 0 || foundCategories.length > 0) {
        // Añadir descripciones de procesos
        for (const proc of foundProcesses) {
            if (mainProcess && proc.id === mainProcess.id && responses.length > 0) continue; // Ya manejado arriba
            responses.push(`<h4>${proc.name}</h4><div>${proc.description || `Aquí tienes información general sobre ${proc.name}.`}</div>`);
            // Sugerir categorías si hay un proceso sin categoría específica en la pregunta multi-entidad
            const relatedFaqs = faqs.filter(f => f.processId === proc.id);
            if (relatedFaqs.length > 0) {
                const uniqueCategories = [...new Set(relatedFaqs.map(f => f.categoryId))]
                    .map(catId => categories.find(c => c.id === catId))
                    .filter(Boolean);
                if (uniqueCategories.length > 0) {
                    const categoryList = `<ul>${uniqueCategories.map(c => `<li>${c.name}</li>`).join('')}</ul>`;
                    responses[responses.length - 1] += `<p>También tengo información en las siguientes categorías para <b>${proc.name}</b>:</p>${categoryList}`;
                }
            }
        }
        // Añadir descripciones de categorías (si no se asociaron a un proceso principal)
        for (const cat of foundCategories) {
            // Evitar duplicar si ya se respondió una FAQ específica con mainProcess
            if (mainProcess && faqs.some(f => f.processId === mainProcess.id && f.categoryId === cat.id && loggedProcessCategoryIds.includes(f.id))) {
                continue;
            }
            responses.push(`<h4>${cat.name}</h4><div>${cat.description || `Aquí tienes información general sobre la categoría: ${cat.name}.`}</div>`);
        }

        if (responses.length > 0) {
            return {
                response: responses.join('<hr>'),
                source: 'Múltiples entidades detectadas',
                score: 10,
                needsMoreContext: false,
                processCategoryIds: loggedProcessCategoryIds // Podría estar vacío si solo se dieron descripciones genéricas
            };
        }
    }
    return null;
}

export class DinamicChatbotService {
    /**
     * Intérprete IA: responde dinámicamente según la BD y seed, usando historial si es necesario.
     */
    static async getResponse({ message, history = [], userId = null }) { // Añadir userId para el log
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

        // Inferir proceso y última categoría del historial antes de cualquier respuesta
        let { proceso: inferredProcesoFromHistory, lastCategoriaName: lastCategoriaNameFromHistory } = inferFromHistory(history, processesNorm, categoriesNorm);

        // Intento 1: Buscar si la pregunta es sobre múltiples entidades (ahora también puede usar el historial)
        const multiResponse = await findBestMultiResponse({
            processes: processesNorm,
            categories: categoriesNorm,
            faqs,
            userMessage: message,
            inferredProcesoFromHistory // Pasar el proceso inferido para multi-respuesta
        });
        
        if (multiResponse) {
            // Loguear las respuestas de múltiples entidades
            if (multiResponse.processCategoryIds && multiResponse.processCategoryIds.length > 0) {
                const actionType = await prisma.actionType.findUnique({ where: { name: 'Consultar' } });
                if (actionType) {
                    for (const pcId of multiResponse.processCategoryIds) {
                        await prisma.processCategoryLog.create({
                            data: {
                                processCategoryId: pcId,
                                userId: userId, // Usar el userId pasado
                                actionTypeId: actionType.id
                            }
                        });
                    }
                }
            }
            return multiResponse;
        }

        // Intento 2: Extraer entidades del mensaje actual
        let { proceso, categoria } = extractEntities(message, processesNorm, categoriesNorm);

        // Intento 3: Buscar la mejor respuesta específica
        const best = await findBestResponse({
            proceso, // Proceso detectado en el mensaje actual
            categoria, // Categoría detectada en el mensaje actual
            faqs,
            processes: processesNorm,
            categories: categoriesNorm,
            userMessage: message,
            inferredProcesoFromHistory, // Proceso inferido del historial
            lastCategoriaNameFromHistory // Última categoría del historial
        });

        if (best) {
            // Loguear la respuesta si hay un processCategoryId
            if (best.processCategoryId) {
                const actionType = await prisma.actionType.findUnique({ where: { name: 'Consultar' } });
                if (actionType) {
                    await prisma.processCategoryLog.create({
                        data: {
                            processCategoryId: best.processCategoryId,
                            userId: userId, // Usar el userId pasado
                            actionTypeId: actionType.id
                        }
                    });
                }
            }
            return {
                response: best.response,
                source: best.source,
                score: 10,
                needsMoreContext: false
            };
        }

        // Intento 4: Si no se encontró nada relevante pero se detectó una entidad (o se infirió un proceso), preguntar por más detalles.
        if (proceso || categoria || inferredProcesoFromHistory) {
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