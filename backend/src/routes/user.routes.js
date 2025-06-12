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
router.get('/user-types', getUserTypesController);
// Rutas para obtener todos los usuarios
router.get('/', getAllUsers);
// Ruta para obtener un usuario por ID
router.get('/:id', getUser);
// Ruta para actualizar el nombre completo de un usuario
router.put('/:id/complete-name', updateCompleteNameController);
// Ruta para actualizar el email de un usuario
router.put('/:id/email', updateEmailController);
// Ruta para actualizar el nombre de usuario de un usuario
router.put('/:id/username', updateUsernameController);
// Ruta para actualizar la contraseña de un usuario
router.put('/:id/password', updatePasswordController);
// Ruta para habilitar/deshabilitar un usuario
router.put('/:id/toggle-enabled', disabledEnabledUserController);

// Exportar el router
export default router;