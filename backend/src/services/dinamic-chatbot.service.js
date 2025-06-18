/**
 * Dinamic Chatbot Service
 *
 * Provides business logic for dynamic chatbot responses, including entity extraction, context inference, and FAQ matching. Handles normalization, multi-entity queries, and logging of user interactions.
 *
 * Exports:
 *   - DinamicChatbotService.getResponse: Main entry to get a dynamic chatbot response based on user message and history
 */

import { prisma } from '../libs/prisma.lib.js';

/**
 * Normalize a string: lowercase, remove accents, remove special characters.
 * @param {string} str
 * @returns {string}
 */
function normalize(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9\s]/gi, '')
        .trim();
}

/**
 * Extract process and category entities from a message using normalized matching and heuristics.
 * @param {string} msg
 * @param {Array} processes
 * @param {Array} categories
 * @returns {{ proceso: Object|null, categoria: Object|null }}
 */
function extractEntities(msg, processes, categories) {
    const cleanMsg = normalize(msg);
    let proceso = null, categoria = null;

    const sortedProcesses = [...processes].sort((a, b) => b.norm.length - a.norm.length);
    for (const p of sortedProcesses) {
        if (cleanMsg.includes(p.norm) || (p.name === 'Prácticas Profesionales' && cleanMsg.includes('practicas'))) {
            proceso = p;
            break;
        }
    }

    const sortedCategories = [...categories].sort((a, b) => b.norm.length - a.norm.length);
    for (const c of sortedCategories) {
        if (cleanMsg.includes(c.norm)) {
            categoria = c;
            break;
        }
    }

    if (!categoria && (cleanMsg.includes('requisitos') || cleanMsg.includes('cuales son') || cleanMsg.includes('que pide'))) {
        const requisitosCat = categories.find(c => c.norm === normalize('requisitos'));
        if (requisitosCat) {
            categoria = requisitosCat;
        }
    }

    if (proceso && !categoria && (cleanMsg.includes('que es') || cleanMsg.includes('que son') || cleanMsg === proceso.norm)) {
        const infoGeneralCat = categories.find(c => c.norm === normalize('informacion general'));
        if (infoGeneralCat) {
            categoria = infoGeneralCat;
        }
    }

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

/**
 * Extract all mentioned entities (processes and categories) from a message.
 * @param {string} msg
 * @param {Array} processes
 * @param {Array} categories
 * @returns {{ foundProcesses: Array, foundCategories: Array }}
 */
function extractAllEntities(msg, processes, categories) {
    const cleanMsg = normalize(msg);
    const foundProcesses = processes.filter(p => cleanMsg.includes(p.norm));
    const foundCategories = categories.filter(c => cleanMsg.includes(c.norm));
    return { foundProcesses, foundCategories };
}

/**
 * Infer process and last category from chat history.
 * @param {Array} history
 * @param {Array} processes
 * @param {Array} categories
 * @returns {{ proceso: Object|null, lastCategoriaName: string|null }}
 */
function inferFromHistory(history, processes, categories) {
    let inferredProceso = null;
    let lastCategoriaName = null;

    if (!Array.isArray(history)) return { proceso: null, lastCategoriaName: null };

    for (let i = history.length - 1; i >= 0; i--) {
        const h = history[i]?.message || '';
        const { proceso: pHist, categoria: cHist } = extractEntities(h, processes, categories);

        if (pHist && !inferredProceso) {
            inferredProceso = pHist;
        }
        if (cHist && !lastCategoriaName) {
            lastCategoriaName = cHist.name;
        }

        if (inferredProceso && lastCategoriaName) break;
    }
    return { proceso: inferredProceso, lastCategoriaName: lastCategoriaName };
}

/**
 * Determine if the message is a direct query about the entity.
 * @param {string} msg
 * @param {Object} entity
 * @returns {boolean}
 */
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

/**
 * Find the best FAQ response based on detected or inferred process/category and user message.
 * @param {Object} params
 * @returns {Promise<Object|null>} Best response object or null if not found.
 */
async function findBestResponse({ proceso, categoria, faqs, processes, categories, userMessage, inferredProcesoFromHistory, lastCategoriaNameFromHistory }) {

    let targetProceso = proceso;
    let targetCategoria = categoria;

    if (proceso && !categoria && lastCategoriaNameFromHistory) {
        const lastCatObj = categories.find(c => normalize(c.name) === normalize(lastCategoriaNameFromHistory));
        if (lastCatObj) {
            const faqWithPreviousCategory = faqs.find(f => f.processId === proceso.id && f.categoryId === lastCatObj.id);
            if (faqWithPreviousCategory && faqWithPreviousCategory.response) {
                return { response: faqWithPreviousCategory.response, source: `${proceso.name} / ${lastCatObj.name} (inferido)`, processCategoryId: faqWithPreviousCategory.id };
            }
        }
    }

    if (proceso && categoria) {
        const faq = faqs.find(f => f.processId === proceso.id && f.categoryId === categoria.id);
        if (faq && faq.response) {
            return { response: faq.response, source: `${proceso.name} / ${categoria.name}`, processCategoryId: faq.id };
        }
    }

    if (!targetProceso && inferredProcesoFromHistory) {
        if (targetCategoria) {
            const faqWithInferredProcess = faqs.find(f => f.processId === inferredProcesoFromHistory.id && f.categoryId === targetCategoria.id);
            if (faqWithInferredProcess && faqWithInferredProcess.response) {
                return { response: faqWithInferredProcess.response, source: `${inferredProcesoFromHistory.name} / ${targetCategoria.name}`, processCategoryId: faqWithInferredProcess.id };
            }
        }
        targetProceso = inferredProcesoFromHistory;
    }

    if (categoria && isDirectEntityQuery(userMessage, categoria)) {
        return { response: categoria.description || `Aquí tienes información general sobre la categoría: ${categoria.name}.`, source: `Categoría: ${categoria.name}` };
    }

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

/**
 * Find the best response for multi-entity queries (multiple processes/categories).
 * @param {Object} params
 * @returns {Promise<Object|null>} Multi-entity response object or null if not found.
 */
async function findBestMultiResponse({ processes, categories, faqs, userMessage, inferredProcesoFromHistory }) {
    const cleanMsg = normalize(userMessage);
    const { foundProcesses, foundCategories } = extractAllEntities(userMessage, processes, categories);
    const responses = [];
    const loggedProcessCategoryIds = [];

    let mainProcess = foundProcesses.length === 1 ? foundProcesses[0] : null;
    if (!mainProcess && inferredProcesoFromHistory) {
        const relatedToInferred = foundCategories.some(cat =>
            faqs.some(faq => faq.processId === inferredProcesoFromHistory.id && faq.categoryId === cat.id)
        );
        if (relatedToInferred) {
            mainProcess = inferredProcesoFromHistory;
        }
    }

    if (/(ambas|ambos)/.test(cleanMsg) && foundProcesses.length === 0 && processes.length === 2) {
        foundProcesses.push(...processes);
        mainProcess = null;
    }

    if (mainProcess && foundCategories.length > 0) {
        for (const cat of foundCategories) {
            const faq = faqs.find(f => f.processId === mainProcess.id && f.categoryId === cat.id);
            if (faq && faq.response) {
                responses.push(`<h4>${mainProcess.name} / ${cat.name}</h4><div>${faq.response}</div>`);
                loggedProcessCategoryIds.push(faq.id);
            } else {
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
    
    if (foundProcesses.length > 0 || foundCategories.length > 0) {
        for (const proc of foundProcesses) {
            if (mainProcess && proc.id === mainProcess.id && responses.length > 0) continue;
            responses.push(`<h4>${proc.name}</h4><div>${proc.description || `Aquí tienes información general sobre ${proc.name}.`}</div>`);
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

        for (const cat of foundCategories) {
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
                processCategoryIds: loggedProcessCategoryIds
            };
        }
    }
    return null;
}

/**
 * DinamicChatbotService: Main class for dynamic chatbot logic.
 * Provides a static method to get a response based on user message and chat history.
 */
export class DinamicChatbotService {
    /**
     * Get a dynamic chatbot response based on user message and history.
     * Loads FAQs, processes, and categories, normalizes data, infers context, and logs interactions.
     * @param {Object} params
     * @param {string} params.message - User message
     * @param {Array} [params.history] - Chat history
     * @param {number|string|null} [params.userId] - User ID for logging
     * @returns {Promise<Object>} Response object with answer, source, score, and context flags
     */
    static async getResponse({ message, history = [], userId = null }) {
        if (!message || typeof message !== 'string' || message.trim().length < 2) {
            return {
                response: 'Por favor, escribe tu duda o mensaje.',
                source: null,
                score: 0,
                needsMoreContext: false
            };
        }

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

        const processesNorm = processes.map(p => ({ ...p, norm: normalize(p.name) }));
        const categoriesNorm = categories.map(c => ({ ...c, norm: normalize(c.name) }));

        let { proceso: inferredProcesoFromHistory, lastCategoriaName: lastCategoriaNameFromHistory } = inferFromHistory(history, processesNorm, categoriesNorm);

        const multiResponse = await findBestMultiResponse({
            processes: processesNorm,
            categories: categoriesNorm,
            faqs,
            userMessage: message,
            inferredProcesoFromHistory
        });
        
        if (multiResponse) {
            if (multiResponse.processCategoryIds && multiResponse.processCategoryIds.length > 0) {
                const actionType = await prisma.actionType.findUnique({ where: { name: 'Consultar' } });
                if (actionType) {
                    for (const pcId of multiResponse.processCategoryIds) {
                        await prisma.processCategoryLog.create({
                            data: {
                                processCategoryId: pcId,
                                userId: userId,
                                actionTypeId: actionType.id
                            }
                        });
                    }
                }
            }
            return multiResponse;
        }

        let { proceso, categoria } = extractEntities(message, processesNorm, categoriesNorm);

        const best = await findBestResponse({
            proceso,
            categoria,
            faqs,
            processes: processesNorm,
            categories: categoriesNorm,
            userMessage: message,
            inferredProcesoFromHistory,
            lastCategoriaNameFromHistory
        });

        if (best) {
            if (best.processCategoryId) {
                const actionType = await prisma.actionType.findUnique({ where: { name: 'Consultar' } });
                if (actionType) {
                    await prisma.processCategoryLog.create({
                        data: {
                            processCategoryId: best.processCategoryId,
                            userId: userId,
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

        if (proceso || categoria || inferredProcesoFromHistory) {
            const detectedEntityName = proceso?.name || inferredProcesoFromHistory?.name || categoria?.name;
            return {
                response: `Entiendo que tu pregunta está relacionada con "${detectedEntityName}". ¿Podrías ser más específico sobre lo que necesitas saber? Por ejemplo, ¿quieres información sobre requisitos, documentos, o el proceso de inscripción?`,
                source: 'Solicitud de Clarificación',
                score: 5,
                needsMoreContext: true
            };
        }

        return {
            response: 'Disculpa, no pude encontrar información relevante para tu pregunta. Por favor, intenta reformularla o sé más específico.',
            source: null,
            score: 0,
            needsMoreContext: true
        };
    }
}