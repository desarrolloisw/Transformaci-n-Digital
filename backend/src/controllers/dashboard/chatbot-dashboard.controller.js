/**
 * Chatbot Dashboard controller
 *
 * Handles analytics and statistics requests for the chatbot dashboard. Validates query parameters and delegates business logic to the dashboard service layer.
 *
 * Exports:
 *   - getFirstLogDateCtrl: Get the earliest log date
 *   - getProcessCountCtrl: Get the number of questions per process
 *   - getCategoryCountCtrl: Get the number of questions per category
 *   - getCategoryCountByProcessCtrl: Get the number of questions per category for a specific process
 *   - getTotalQuestionsCtrl: Get the total number of questions
 *   - getTotalQuestionsByProcessCtrl: Get the total number of questions for a specific process
 */

import {
  getFirstLogDate,
  getProcessCount,
  getCategoryCount,
  getCategoryCountByProcess,
  getTotalQuestions,
  getTotalQuestionsByProcess,
} from '../../services/dashboard/chatbot-dashboard.service.js';
import { dateRangeSchema, processIdSchema } from '../../schemas/dashboard/chatbot-dashboard.schema.js';
import { ZodError } from 'zod';

/**
 * Parse date range from query parameters using Zod schema.
 * @param {Object} query
 * @returns {Object} Parsed date range
 */
function parseDateRangeQuery(query) {
  return dateRangeSchema.parse({
    from: query.from,
    to: query.to,
  });
}

/**
 * Parse process ID and date range from query parameters using Zod schema.
 * @param {Object} query
 * @returns {Object} Parsed processId and date range
 */
function parseProcessIdQuery(query) {
  return processIdSchema.parse({
    from: query.from,
    to: query.to,
    processId: query.processId,
  });
}

/**
 * Get the earliest log date for the dashboard.
 * @param {Request} req
 * @param {Response} res
 */
export async function getFirstLogDateCtrl(req, res) {
  const date = await getFirstLogDate();
  res.json({ firstLogDate: date });
}

/**
 * Get the number of questions per process.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function getProcessCountCtrl(req, res, next) {
  try {
    const { from, to } = parseDateRangeQuery(req.query);
    const data = await getProcessCount({ from, to });
    res.json({ data });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    next(err);
  }
}

/**
 * Get the number of questions per category.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function getCategoryCountCtrl(req, res, next) {
  try {
    const { from, to } = parseDateRangeQuery(req.query);
    const data = await getCategoryCount({ from, to });
    res.json({ data });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    next(err);
  }
}

/**
 * Get the number of questions per category for a specific process.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function getCategoryCountByProcessCtrl(req, res, next) {
  try {
    const { from, to, processId } = parseProcessIdQuery(req.query);
    const data = await getCategoryCountByProcess({ from, to, processId });
    res.json({ data });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    next(err);
  }
}

/**
 * Get the total number of questions.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function getTotalQuestionsCtrl(req, res, next) {
  try {
    const { from, to } = parseDateRangeQuery(req.query);
    const total = await getTotalQuestions({ from, to });
    res.json({ total });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    next(err);
  }
}

/**
 * Get the total number of questions for a specific process.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function getTotalQuestionsByProcessCtrl(req, res, next) {
  try {
    const { from, to, processId } = parseProcessIdQuery(req.query);
    const total = await getTotalQuestionsByProcess({ from, to, processId });
    res.json({ total });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    next(err);
  }
}