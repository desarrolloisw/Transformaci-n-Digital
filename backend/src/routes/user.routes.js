import Router from 'express';
import { getAllUsers, 
    createUserController, 
    disabledEnabledUserController, 
    getUser,
    updateCompleteNameController, 
    updateEmailController,
    updatePasswordController,
    updateUsernameController,
    getUserTypesController } from '../controllers/user.controller.js';

const router = Router();

// Ruta para obtener los tipos de usuario
router.get('/user-types', getUserTypesController);
// Rutas para obtener todos los usuarios
router.get('/', getAllUsers);
// Ruta para obtener un usuario por ID
router.get('/:id', getUser);
// Ruta para crear un nuevo usuario
router.post('/', createUserController);
// Ruta para actualizar el nombre completo de un usuario
router.put('/complete-name', updateCompleteNameController);
// Ruta para actualizar el email de un usuario
router.put('/email', updateEmailController);
// Ruta para actualizar el nombre de usuario de un usuario
router.put('/username', updateUsernameController);
// Ruta para actualizar la contraseña de un usuario
router.put('/password', updatePasswordController);
// Ruta para habilitar/deshabilitar un usuario
router.put('/toggle-enabled', disabledEnabledUserController);

// Exportar el router
export default router;