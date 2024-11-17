import express from 'express';
import CategoryController from '../controllers/category.controller.js';

const router = express.Router();

// Rutas para categorías
router.post('/', CategoryController.createCategory);
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Categoría creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear la categoría
 */
router.get('/all', CategoryController.getAllCategories);
/**
 * @swagger
 * /api/categories/all:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorías]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Campo por el cual ordenar
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Orden (asc o desc)
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error al obtener las categorías
 */
router.get('/:id', CategoryController.getCategoryById);
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al obtener la categoría
 */
router.put('/:id', CategoryController.updateCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar una categoría por ID
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Categoría actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al actualizar la categoría
 */
router.delete('/:id', CategoryController.deleteCategory);
/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría por ID
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada con éxito
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al eliminar la categoría
 */

export default router;