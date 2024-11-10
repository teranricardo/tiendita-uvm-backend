import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import { deleteFile } from '../config/upload.js';

class ProductController {
  // Crear un nuevo cuenta producto
  async createProduct(req, res) {
    console.log('Datos recibidos:', req.body); console.log('Archivo recibido:', req.file);
    const { name, description, price, category_id } = req.body;
    const image = req.file ? req.file.filename : null; // Obtener el nombre del archivo si se cargó uno

    if (!name || !description || !price || !image || !category_id) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
      // Verificar el nombre del producto existe
      const existingProduct = await ProductModel.findOne({ name });
      if (existingProduct) {
        // Eliminar la imágen
        if (image) {
          deleteFile(image);
        }
        return res.status(400).json({ error: 'Ya existe ese producto con ese nombre.' });
      }

      // Verificar si la categoría existe
      const categoryExists = await CategoryModel.findById(category_id);
      if (!categoryExists) {
        // Eliminar la imágen
        if (image) {
          deleteFile(image);
        }
        return res.status(400).json({ error: 'La categoría especificada no existe.' });
      }

      const newProduct = new ProductModel({ name, description, price, image, category_id });
      await newProduct.save();
      res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el producto: ' + error.message });
    }
  }

  // // Obtener todos los productos
  // async getAllProducts(req, res) {
  //   const { sortBy = 'name', order = 'asc' } = req.query;

  //   try {
  //     const products = await ProductModel.find().sort({ [sortBy]: order === 'asc' ? 1 : -1 });
  //     res.status(200).json(products);
  //   } catch (error) {
  //     res.status(500).json({ error: 'Error al obtener los productos: ' + error.message });
  //   }
  // }

  // Obtener todos los productos
  async getAllProducts(req, res) {
    const { sortBy = 'name', order = 'asc' } = req.query;

    try {
      // Usar populate para incluir el nombre y la descripción de la categoría
      const products = await ProductModel.find()
        // .populate('category_id', 'name description') // 'name description' especifica qué campos incluir de la categoría
        .populate('category_id', 'name') // 'name description' especifica qué campos incluir de la categoría
        .sort({ [sortBy]: order === 'asc' ? 1 : -1 });

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos: ' + error.message });
    }
  }


  // Obtener un producto por ID
  async getProductById(req, res) {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Producto no encontrada' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto: ' + error.message });
    }
  }

  // Obtener todas los productos con paginación
  async getWithPagination(req, res) {
    const { page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;

    try {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      if (pageNumber <= 0 || pageSize <= 0) {
        return res.status(400).json({ error: 'Número de página y tamaño de página deben ser mayores a cero.' });
      }

      const products = await ProductModel.find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ [sortBy]: order === 'asc' ? 1 : -1 });

      const totalProducts = await ProductModel.countDocuments();

      res.status(200).json({
        totalProducts: totalProducts,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalProducts / pageSize),
        products: products
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos: ' + error.message });
    }
  }

  // Buscar productos por nombre y descripción
  async searchProducts(req, res) {
    const { query, sortBy = 'name', order = 'asc' } = req.query;

    try {
      const products = await ProductModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ]
      }).sort({ [sortBy]: order === 'asc' ? 1 : -1 });

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar los productos: ' + error.message });
    }
  }

  // Actualizar un producto
  async updateProduct(req, res) {
    const { name, description, price, category_id } = req.body;
    const productId = req.params.id;

    try {
      const product = await ProductModel.findById(productId);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

      // Verificar si la categoría existe
      const categoryExists = await CategoryModel.findById(category_id);
      if (!categoryExists) {
        return res.status(400).json({ error: 'La categoría especificada no existe.' });
      }

      // Verificar si la categoría existe sin contar la propia
      const existingProduct = await ProductModel.findOne({ name, _id: { $ne: productId } });
      if (existingProduct) {
        return res.status(400).json({ error: 'Ya existe una catogoría con ese nombre.' });
      }

      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = price;
      if (category_id) product.category_id = category_id;

      // Manejar la actualización de la imagen
      if (req.file) {
        if (product.image) {
          deleteFile(product.image);
        }
        product.image = req.file.filename;
      }

      await product.save();
      res.status(200).json({ message: 'Producto actualizada exitosamente', product });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto: ' + error.message });
    }
  }

  // Eliminar un producto
  async deleteProduct(req, res) {
    try {
      const product = await ProductModel.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

      // Eliminar la imágen asociada si existe
      if (product.image) {
        deleteFile(product.image);
      }

      res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto: ' + error.message });
    }
  }
}

export default new ProductController();