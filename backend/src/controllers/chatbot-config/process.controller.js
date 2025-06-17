import { getProcesses, getProcessById, createProcess, updateProcess, disableProcess, enableProcess } from '../../services/chatbot-config/process.service.js';
import { processSchema, processUpdateSchema } from '../../schemas/chatbot-config/process.schema.js';
import { processConfirmationSchema } from '../../schemas/chatbot-config/process.schema.js';

export async function getAllProcesses(req, res) {
  try {
    const { search } = req.query;
    const processes = await getProcesses({ search });
    res.status(200).json(processes.map(p => processConfirmationSchema.parse(p)));
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener procesos', error: error.message });
  }
}

export async function getProcess(req, res) {
  try {
    const process = await getProcessById(req.params.id);
    res.status(200).json(processConfirmationSchema.parse(process));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function createProcessController(req, res) {
  try {
    const parse = processSchema.safeParse(req.body);
    if (!parse.success) {
      // Si la validación falla aquí, devolver todos los issues
      return res.status(400).json({
        message: "Datos de proceso inválidos",
        errors: parse.error.issues
      });
    }
    const process = await createProcess(parse.data);
    res.status(201).json(processConfirmationSchema.parse(process));
  } catch (error) {
    // Si el error tiene detalles de validación, devolverlos igual que en login
    if (error.validation) {
      return res.status(400).json({
        message: "Datos de proceso inválidos",
        errors: Object.entries(error.validation).flatMap(([field, messages]) =>
          messages.map(msg => ({
            code: 'invalid_type',
            path: [field],
            message: msg
          }))
        )
      });
    }
    res.status(400).json({
      message: "Error al crear el proceso",
      error: error.message
    });
  }
}

export async function updateProcessController(req, res) {
  const parse = processUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
  }
  try {
    const processId = req.params.id;
    const current = await getProcessById(processId);
    // Solo comparar y actualizar si hay cambios
    let hasChanges = false;
    if (parse.data.name !== undefined && parse.data.name !== current.name) hasChanges = true;
    if (parse.data.description !== undefined && parse.data.description !== current.description) hasChanges = true;
    if (parse.data.isActive !== undefined && parse.data.isActive !== current.isActive) hasChanges = true;
    if (!hasChanges) {
      return res.status(200).json({ message: 'No hay cambios para actualizar.' });
    }
    const updated = await updateProcess(processId, parse.data);
    res.status(200).json(processConfirmationSchema.parse(updated));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function toggleProcessActiveController(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuario no autenticado' });
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'El campo isActive (boolean) es requerido.' });
    }
    let result;
    if (isActive) {
      result = await enableProcess(req.params.id, userId);
      res.status(200).json({ message: 'Proceso y FAQs habilitados', ...result });
    } else {
      result = await disableProcess(req.params.id, userId);
      res.status(200).json({ message: 'Proceso y FAQs deshabilitados', ...result });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
