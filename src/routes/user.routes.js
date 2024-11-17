import express from 'express';
import UserController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas para registrar usuarios
router.post('/register', UserController.registerUser);
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               username:
 *                 type: string
 *                 description: Nombre de usuario único
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *               role:
 *                 type: string
 *                 enum: [admin, editor]
 *                 description: Rol del usuario (admin o editor)
 *               profile_image:
 *                 type: string
 *                 description: URL de la imagen de perfil
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al registrar el usuario
 */
router.post('/login', UserController.loginUser);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación JWT
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error al iniciar sesión
 */
router.get('/count-admin-principals', UserController.countAdminPrincipals);
/**
 * @swagger
 * /api/users/count-admin-principals:
 *   get:
 *     summary: Contar la cantidad de administradores
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Número de administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Número de administradores
 *       500:
 *         description: Error al contar los administradores
 */
router.get('/all', authMiddleware(['admin']), UserController.getAllUsers);
/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error al obtener los usuarios
 */
router.get('/:id', authMiddleware(['admin']), UserController.getUserById);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 */
router.put('/:id', authMiddleware(['admin']), UserController.updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               username:
 *                 type: string
 *                 description: Nombre de usuario único
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *               role:
 *                 type: string
 *                 enum: [admin, editor]
 *                 description: Rol del usuario (admin o editor)
 *               profile_image:
 *                 type: string
 *                 description: URL de la imagen de perfil
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar el usuario
 */
router.delete('/:id', authMiddleware(['admin']), UserController.deleteUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar el usuario
 */

export default router;