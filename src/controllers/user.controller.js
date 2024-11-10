import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { deleteFile } from '../config/upload.js';

class UserController {
  // Registro de usuario
  async registerUser(req, res) {
    const { name, username, password, role = 'admin' } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!username.match(usernameRegex) || username.includes(' ')) {
      return res.status(400).json({ message: 'El nombre de usuario no es válido. Solo puede contener letras, números, guiones bajos, puntos y guiones, y no puede contener espacios.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,128}$/;
    if (!password.match(passwordRegex)) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, e incluir al menos una letra mayúscula, un número y un carácter especial' });
    }

    try {
      // Verificar si el nombre de usuario ya existe
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso. Por favor, elige otro nombre.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ name, username, password: hashedPassword, role });

      await newUser.save();
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el usuario: ' + error.message });
    }
  }

  // Inicio de sesión
  async loginUser(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) return res.status(400).json({ message: 'Credenciales inválidas' });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ result: user, token });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión: ' + error.message });
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(req, res) {
    const { sortBy = 'username', order = 'asc' } = req.query;
    try {
      const users = await User.find().sort({ [sortBy]: order === 'asc' ? 1 : -1 });;
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios: ' + error.message });
    }
  }

  // Obtener usuario por ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario: ' + error.message });
    }
  }

  // Actualizar usuario
  async updateUser(req, res) {
    const { name, username, password, role } = req.body;
    const userId = req.params.id;


    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (username && (!username.match(usernameRegex) || username.includes(' '))) {
      return res.status(400).json({ error: 'El nombre de usuario no es válido. Solo puede contener letras, números, guiones bajos, puntos y guiones, y no puede contener espacios.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,128}$/;
    if (password && (!password.match(passwordRegex))) {
      return res.status(400).json({ error: 'La contraseña debe tener entre 8 y 128 caracteres, e incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial, y no puede contener espacios.' });
    }

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      // Verificar si el nombre de usuario ya existe
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso. Por favor, elige otro nombre.' });
      }

      if (name) user.name = name;
      if (username) user.username = username;
      if (password) user.password = await bcrypt.hash(password, 12);
      if (role) user.role = role;

      // Manejar la actualización de la foto de perfil
      if (req.file) {
        if (user.profile_image) {
          deleteFile(user.profile_image);
        }
        user.profile_image = req.file.filename;
      }

      await user.save();
      res.status(200).json({ message: 'Usuario actualizado exitosamente', user });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el usuario: ' + error.message });
    }
  }

  // Eliminar usuario
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      // Eliminar foto de perfil asociado si existe
      if (user.profile_image) {
        deleteFile(user.profile_image);
      }

      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario: ' + error.message });
    }
  }

  // Obtener el conteo de usuarios con rol admin_principal
  async countAdminPrincipals(req, res) {
    try {
      const count = await User.countDocuments({ role: 'admin' });
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Error al contar los usuarios admin: ' + error.message });
    }
  }
}

export default new UserController();