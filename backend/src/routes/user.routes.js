import Router from 'express';
import { getAllUsers, 
    disabledEnabledUserController, 
    getUser,
    updateCompleteNameController, 
    updateEmailController,
    updatePasswordController,
    updateUsernameController,
    getUserTypesController } from '../controllers/user.controller.js';
import { authenticateToken, isPAT } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta para obtener los tipos de usuario
router.get('/user-types', authenticateToken, isPAT, getUserTypesController);
// Rutas para obtener todos los usuarios
router.get('/', authenticateToken, isPAT, getAllUsers);
// Ruta para obtener un usuario por ID
router.get('/:id', authenticateToken, isPAT, getUser);
// Ruta para actualizar el nombre completo de un usuario
router.put('/:id/complete-name', authenticateToken, isPAT, updateCompleteNameController);
// Ruta para actualizar el email de un usuario
router.put('/:id/email', authenticateToken, isPAT, updateEmailController);
// Ruta para actualizar el nombre de usuario de un usuario
router.put('/:id/username', authenticateToken, isPAT, updateUsernameController);
// Ruta para actualizar la contraseña de un usuario
router.put('/:id/password', authenticateToken, isPAT, updatePasswordController);
// Ruta para habilitar/deshabilitar un usuario
router.put('/:id/toggle-enabled', authenticateToken, isPAT, disabledEnabledUserController);

// Exportar el router
export default router;