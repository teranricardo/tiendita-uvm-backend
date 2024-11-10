import express from 'express';
import CategoryController from '../controllers/category.controller.js';

const router = express.Router();

// Rutas para categrías
router.post('/', CategoryController.createCategory);
router.get('/all', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;