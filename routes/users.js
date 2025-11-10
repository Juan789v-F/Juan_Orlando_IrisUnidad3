const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Datos temporales (en producción usar base de datos)
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@tecnologia.com',
    role: 'admin',
    createdAt: new Date()
  }
];

// Obtener todos los usuarios (solo admin)
router.get('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const userList = users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));

  res.json({ users: userList });
});

// Obtener usuario por ID
router.get('/:id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  
  // Solo el usuario mismo o un admin puede ver el perfil
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// Actualizar usuario
router.put('/:id', authenticateToken, [
  body('username').optional().isLength({ min: 3 }).trim().escape(),
  body('email').optional().isEmail().normalizeEmail()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = parseInt(req.params.id);
    
    // Solo el usuario mismo o un admin puede actualizar
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar campos permitidos
    if (req.body.username) {
      users[userIndex].username = req.body.username;
    }
    if (req.body.email) {
      users[userIndex].email = req.body.email;
    }

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: {
        id: users[userIndex].id,
        username: users[userIndex].username,
        email: users[userIndex].email,
        role: users[userIndex].role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // No permitir eliminar al usuario actual
  if (users[userIndex].id === req.user.id) {
    return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
  }

  users.splice(userIndex, 1);
  res.json({ message: 'Usuario eliminado exitosamente' });
});

module.exports = router;