import CategoryModel from '../models/category.model.js';

class CategoryController {
  // Crear una nueva categoría
  async createCategory(req, res) {
    const { name, description } = req.body;

    // Verificar que todos los campos obligatorios estén presentes
    if (!name || !description) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
      // Verificar si la categoría ya existe
      const existingCategory = await CategoryModel.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ error: 'Ya existe esa categoría con ese nombre.' });
      }

      // Crear una nueva categoría
      const newCategory = new CategoryModel({ name, description });
      await newCategory.save();
      res.status(201).json({ message: 'Categoría creada exitosamente', category: newCategory });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la categoría: ' + error.message });
    }
  }

  // Obtener todas las categorías
  async getAllCategories(req, res) {
    const { sortBy = 'name', order = 'asc' } = req.query;

    try {
      const category = await CategoryModel.find().sort({ [sortBy]: order === 'asc' ? 1 : -1 });
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las categorías: ' + error.message });
    }
  }

  // Obtener una categoría por ID
  async getCategoryById(req, res) {
    try {
      const category = await CategoryModel.findById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la categoría: ' + error.message });
    }
  }

  // Actualizar una categoría
  async updateCategory(req, res) {
    const { name, description } = req.body;
    const categoryId = req.params.id;

    try {
      const category = await CategoryModel.findById(categoryId);
      if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });

      // Verificar si la categoría existe sin contar la propia
      const existingCategory = await CategoryModel.findOne({ name, _id: { $ne: categoryId } });
      if (existingCategory) {
        return res.status(400).json({ error: 'Ya existe una catogoría con ese nombre.' });
      }

      if (name) category.name = name;
      if (description) category.description = description;

      await category.save();
      res.status(200).json({ message: 'Categoría actualizada exitosamente', category });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la categoría: ' + error.message });
    }
  }

  // Eliminar una categoría
  async deleteCategory(req, res) {
    try {
      const category = await CategoryModel.findByIdAndDelete(req.params.id);
      if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });

      res.status(200).json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la catgoría: ' + error.message });
    }
  }
}

export default new CategoryController();