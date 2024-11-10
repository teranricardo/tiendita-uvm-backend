import express from 'express';
import ProductController from '../controllers/product.controller.js';
import { upload } from '../config/upload.js';

const router = express.Router();

// Rutas para cuentas bancarias
router.post('/', upload.single('image'), ProductController.createProduct);
router.get('/all', ProductController.getAllProducts);
router.get('/', ProductController.getWithPagination);
router.get('/search', ProductController.searchProducts);
router.get('/:id', ProductController.getProductById);
router.put('/:id', upload.single('image'), ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export default router;