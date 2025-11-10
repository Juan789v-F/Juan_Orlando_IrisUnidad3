const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
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

// Datos temporales de productos tecnológicos
let products = [
  {
    id: 1,
    name: 'Smartphone Pro Max',
    category: 'Smartphones',
    description: 'Teléfono inteligente de última generación con 5G',
    price: 999.99,
    brand: 'TechCorp',
    specifications: {
      processor: 'Snapdragon 8 Gen 2',
      ram: '8GB',
      storage: '256GB',
      camera: '108MP'
    },
    stock: 50,
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Laptop Gaming Ultra',
    category: 'Laptops',
    description: 'Laptop para gaming con GPU de alta gama',
    price: 1499.99,
    brand: 'GameTech',
    specifications: {
      processor: 'Intel i9-13900H',
      ram: '32GB',
      storage: '1TB SSD',
      gpu: 'RTX 4080'
    },
    stock: 25,
    createdAt: new Date()
  },
  {
    id: 3,
    name: 'Smart Watch Health',
    category: 'Wearables',
    description: 'Reloj inteligente con monitoreo de salud avanzado',
    price: 299.99,
    brand: 'HealthTech',
    specifications: {
      battery: '7 días',
      sensors: 'Frecuencia cardíaca, GPS, Oxímetro',
      water_resistant: 'IP68'
    },
    stock: 100,
    createdAt: new Date()
  }
];

// Obtener todos los productos
router.get('/', (req, res) => {
  const { category, brand, minPrice, maxPrice } = req.query;
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (brand) {
    filteredProducts = filteredProducts.filter(p => 
      p.brand.toLowerCase().includes(brand.toLowerCase())
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }

  res.json({ 
    products: filteredProducts,
    total: filteredProducts.length 
  });
});

// Obtener producto por ID
router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json({ product });
});

// Crear nuevo producto (solo admin)
router.post('/', authenticateToken, [
  body('name').isLength({ min: 3 }).trim().escape(),
  body('category').isLength({ min: 2 }).trim().escape(),
  body('description').isLength({ min: 10 }).trim().escape(),
  body('price').isFloat({ min: 0 }),
  body('brand').isLength({ min: 2 }).trim().escape(),
  body('stock').isInt({ min: 0 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado - Se requiere rol de administrador' });
    }

    const newProduct = {
      id: products.length + 1,
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      brand: req.body.brand,
      specifications: req.body.specifications || {},
      stock: req.body.stock,
      createdAt: new Date()
    };

    products.push(newProduct);

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Actualizar producto (solo admin)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado - Se requiere rol de administrador' });
    }

    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar campos permitidos
    const allowedFields = ['name', 'category', 'description', 'price', 'brand', 'specifications', 'stock'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        products[productIndex][field] = req.body[field];
      }
    });

    res.json({
      message: 'Producto actualizado exitosamente',
      product: products[productIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar producto (solo admin)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado - Se requiere rol de administrador' });
    }

    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;