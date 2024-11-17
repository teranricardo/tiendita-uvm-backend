import express from 'express';
import ProductController from '../controllers/product.controller.js';
import { upload } from '../config/upload.js';

const router = express.Router();

// Rutas para productos
router.post('/', upload.single('image'), ProductController.createProduct);
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto
 *               category_id:
 *                 type: string
 *                 description: ID de la categoría del producto
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear el producto
 */
router.get('/all', ProductController.getAllProducts);
/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error al obtener los productos
 */
router.get('/', ProductController.getWithPagination);
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener productos con paginación
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página de productos
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de productos por página
 *     responses:
 *       200:
 *         description: Lista de productos con paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error al obtener productos
 */
router.get('/search', ProductController.searchProducts);
/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Buscar productos por nombre o descripción
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre o descripción)
 *     responses:
 *       200:
 *         description: Lista de productos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error al buscar productos
 */
router.get('/:id', ProductController.getProductById);
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener el producto
 */
router.put('/:id', upload.single('image'), ProductController.updateProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto
 *               category_id:
 *                 type: string
 *                 description: ID de la categoría del producto
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al actualizar el producto
 */
router.delete('/:id', ProductController.deleteProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al eliminar el producto
 */

export default router;