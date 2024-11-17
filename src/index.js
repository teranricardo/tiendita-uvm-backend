import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import { swaggerSpec } from './swagger.js';
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import { upload } from './config/upload.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Definir __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.status(201).json({ file: req.file });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
});

// Middleware para servir archivos estáticos (Imágenes)
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para ver la docmentación (OpenAPI)
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware para manejar rutas no definidas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ocurrió un error en el servidor' });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});