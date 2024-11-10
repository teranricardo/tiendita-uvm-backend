import express from 'express';
import UserController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas para registrar usuarios
router.post('/register', UserController.registerUser);

// Ruta para iniciar sesión
router.post('/login', UserController.loginUser);

// Ruta para contar la cantidad de admins con el rol admin
router.get('/count-admin-principals', UserController.countAdminPrincipals);

// Rutas protegidas:
router.get('/all', authMiddleware(['admin']), UserController.getAllUsers);
router.get('/:id', authMiddleware(['admin']), UserController.getUserById);
router.put('/:id', authMiddleware(['admin']),  UserController.updateUser);
router.delete('/:id', authMiddleware(['admin']), UserController.deleteUser);

export default router;