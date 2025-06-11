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

function parseDateRangeQuery(query) {
  // Permite recibir from/to por querystring (opcional)
  return dateRangeSchema.parse({
    from: query.from,
    to: query.to,
  });
}

function parseProcessIdQuery(query) {
  return processIdSchema.parse({
    from: query.from,
    to: query.to,
    processId: query.processId,
  });
}

export async function getFirstLogDateCtrl(req, res) {
  const date = await getFirstLogDate();
  res.json({ firstLogDate: date });
}

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