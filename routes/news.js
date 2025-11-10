const express = require('express');
const axios = require('axios');
const router = express.Router();

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Obtener noticias de tecnología
router.get('/tech', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category = 'technology' } = req.query;
    const apiKey = process.env.NEWS_API_KEY || 'demo_key';
    
    // Datos simulados de noticias de tecnología
    const mockTechNews = {
      status: 'ok',
      totalResults: 50,
      articles: [
        {
          id: 1,
          title: 'Inteligencia Artificial Revoluciona la Industria Tecnológica',
          description: 'Nuevos avances en IA están transformando la forma en que interactuamos con la tecnología.',
          content: 'La inteligencia artificial continúa evolucionando a un ritmo acelerado, con nuevas aplicaciones que prometen revolucionar múltiples industrias...',
          author: 'Dr. María González',
          source: {
            name: 'Tech News Daily',
            url: 'https://technewsdaily.com'
          },
          url: 'https://technewsdaily.com/ia-revolucion-industria',
          urlToImage: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=IA+Tecnología',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          category: 'Artificial Intelligence'
        },
        {
          id: 2,
          title: 'Nuevo Smartphone con Batería de 7 Días de Duración',
          description: 'Empresa tecnológica anuncia revolucionaria batería que dura una semana completa.',
          content: 'Una startup tecnológica ha desarrollado una nueva tecnología de baterías que promete cambiar el juego en dispositivos móviles...',
          author: 'Carlos Rodríguez',
          source: {
            name: 'Mobile Tech',
            url: 'https://mobiletech.com'
          },
          url: 'https://mobiletech.com/bateria-7-dias',
          urlToImage: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Batería+Revolutionaria',
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          category: 'Mobile Technology'
        },
        {
          id: 3,
          title: 'Realidad Virtual: El Futuro del Entrenamiento Empresarial',
          description: 'Empresas adoptan VR para capacitar empleados de manera más efectiva.',
          content: 'La realidad virtual está siendo adoptada por grandes corporaciones para mejorar los programas de capacitación de sus empleados...',
          author: 'Ana Martínez',
          source: {
            name: 'VR World',
            url: 'https://vrworld.com'
          },
          url: 'https://vrworld.com/vr-entrenamiento-empresarial',
          urlToImage: 'https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Realidad+Virtual',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
          category: 'Virtual Reality'
        },
        {
          id: 4,
          title: 'Ciberseguridad: Nuevas Amenazas en 2024',
          description: 'Expertos advierten sobre sofisticados ataques cibernéticos que aprovechan la IA.',
          content: 'Los expertos en ciberseguridad están alertando sobre una nueva generación de amenazas que utilizan inteligencia artificial...',
          author: 'Roberto Sánchez',
          source: {
            name: 'CyberSecurity Today',
            url: 'https://cybersecuritytoday.com'
          },
          url: 'https://cybersecuritytoday.com/amenazas-2024',
          urlToImage: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Ciberseguridad',
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          category: 'Cybersecurity'
        },
        {
          id: 5,
          title: 'Blockchain Más Allá de las Criptomonedas',
          description: 'Tecnología blockchain encuentra nuevas aplicaciones en sectores tradicionales.',
          content: 'La tecnología blockchain está evolucionando más allá de las criptomonedas, encontrando aplicaciones en supply chain...',
          author: 'Laura Torres',
          source: {
            name: 'Blockchain Weekly',
            url: 'https://blockchainweekly.com'
          },
          url: 'https://blockchainweekly.com/blockchain-aplicaciones',
          urlToImage: 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Blockchain',
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          category: 'Blockchain'
        }
      ]
    };

    // Simular paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedArticles = mockTechNews.articles.slice(startIndex, endIndex);

    // Simular delay de API real
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({
      message: 'Noticias de tecnología obtenidas exitosamente',
      data: {
        status: 'ok',
        totalResults: mockTechNews.totalResults,
        page: parseInt(page),
        limit: parseInt(limit),
        articles: paginatedArticles
      },
      source: 'NewsAPI (Demo)'
    });
  } catch (error) {
    console.error('Error al obtener noticias:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener noticias de tecnología',
      message: error.message 
    });
  }
});

// Buscar noticias por palabra clave
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }

    // Datos simulados de búsqueda
    const mockSearchResults = {
      status: 'ok',
      totalResults: 25,
      articles: [
        {
          id: 1,
          title: `Resultados de búsqueda para: "${q}"`,
          description: `Artículos relacionados con la búsqueda de ${q} en tecnología.`,
          content: `Se encontraron múltiples artículos relacionados con ${q} en el ámbito tecnológico...`,
          author: 'Sistema de Búsqueda',
          source: {
            name: 'Tech Search Engine',
            url: 'https://techsearchengine.com'
          },
          url: `https://techsearchengine.com/search?q=${encodeURIComponent(q)}`,
          urlToImage: 'https://via.placeholder.com/600x400/6366F1/FFFFFF?text=Búsqueda',
          publishedAt: new Date(),
          category: 'Search Results'
        }
      ]
    };

    // Simular delay de API real
    await new Promise(resolve => setTimeout(resolve, 600));

    res.json({
      message: 'Búsqueda de noticias completada',
      data: mockSearchResults,
      source: 'NewsAPI Search (Demo)'
    });
  } catch (error) {
    console.error('Error al buscar noticias:', error.message);
    res.status(500).json({ 
      error: 'Error al buscar noticias',
      message: error.message 
    });
  }
});

// Obtener noticias por categoría específica
router.get('/category/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const validCategories = ['technology', 'business', 'science', 'health', 'sports'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Categoría no válida',
        validCategories 
      });
    }

    // Datos simulados por categoría
    const mockCategoryNews = {
      status: 'ok',
      totalResults: 30,
      articles: [
        {
          id: 1,
          title: `Últimas noticias de ${category}`,
          description: `Artículos actualizados sobre ${category} y tendencias actuales.`,
          content: `Las noticias más recientes sobre ${category} muestran un crecimiento significativo...`,
          author: 'Editor de Categoría',
          source: {
            name: `${category.charAt(0).toUpperCase() + category.slice(1)} News`,
            url: `https://${category}news.com`
          },
          url: `https://${category}news.com/latest`,
          urlToImage: 'https://via.placeholder.com/600x400/059669/FFFFFF?text=Categoría',
          publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          category: category
        }
      ]
    };

    // Simular delay de API real
    await new Promise(resolve => setTimeout(resolve, 700));

    res.json({
      message: `Noticias de ${category} obtenidas exitosamente`,
      data: mockCategoryNews,
      source: 'NewsAPI Categories (Demo)'
    });
  } catch (error) {
    console.error('Error al obtener noticias por categoría:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener noticias por categoría',
      message: error.message 
    });
  }
});

module.exports = router;