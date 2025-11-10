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

// Obtener clima actual por ciudad
router.get('/current/:city', authenticateToken, async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY || 'demo_key';
    
    // Para demostración, usaremos datos simulados
    // En producción, usar: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    
    const mockWeatherData = {
      city: city,
      country: 'MX',
      temperature: 22,
      feels_like: 24,
      humidity: 65,
      pressure: 1013,
      wind_speed: 3.5,
      wind_direction: 'NE',
      weather: [
        {
          main: 'Clear',
          description: 'Cielo despejado',
          icon: '01d'
        }
      ],
      visibility: 10000,
      uv_index: 6,
      timestamp: new Date()
    };

    // Simular delay de API real
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
      message: 'Datos del clima obtenidos exitosamente',
      data: mockWeatherData,
      source: 'OpenWeatherMap API (Demo)'
    });
  } catch (error) {
    console.error('Error al obtener clima:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener datos del clima',
      message: error.message 
    });
  }
});

// Obtener pronóstico de 5 días
router.get('/forecast/:city', authenticateToken, async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY || 'demo_key';
    
    // Datos simulados de pronóstico
    const mockForecastData = {
      city: city,
      country: 'MX',
      forecast: [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          temperature: { min: 18, max: 25 },
          humidity: 70,
          weather: 'Parcialmente nublado',
          description: 'Algo de nubosidad por la tarde'
        },
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          temperature: { min: 16, max: 23 },
          humidity: 75,
          weather: 'Lluvia ligera',
          description: 'Probabilidad de lluvias dispersas'
        },
        {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          temperature: { min: 19, max: 26 },
          humidity: 60,
          weather: 'Despejado',
          description: 'Día soleado y agradable'
        }
      ]
    };

    // Simular delay de API real
    await new Promise(resolve => setTimeout(resolve, 700));

    res.json({
      message: 'Pronóstico obtenido exitosamente',
      data: mockForecastData,
      source: 'OpenWeatherMap API (Demo)'
    });
  } catch (error) {
    console.error('Error al obtener pronóstico:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener pronóstico del clima',
      message: error.message 
    });
  }
});

// Obtener clima actual por coordenadas
router.get('/coordinates', authenticateToken, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitud y longitud requeridas' });
    }

    // Datos simulados basados en coordenadas
    const mockCoordinateWeather = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      city: 'Ciudad de México',
      country: 'MX',
      temperature: 23,
      feels_like: 25,
      humidity: 68,
      pressure: 1015,
      wind_speed: 4.2,
      wind_direction: 'E',
      weather: [
        {
          main: 'Clouds',
          description: 'Nubes dispersas',
          icon: '03d'
        }
      ],
      timestamp: new Date()
    };

    // Simular delay de API real
    await new Promise(resolve => setTimeout(resolve, 600));

    res.json({
      message: 'Clima por coordenadas obtenido exitosamente',
      data: mockCoordinateWeather,
      source: 'OpenWeatherMap API (Demo)'
    });
  } catch (error) {
    console.error('Error al obtener clima por coordenadas:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener datos del clima',
      message: error.message 
    });
  }
});

module.exports = router;