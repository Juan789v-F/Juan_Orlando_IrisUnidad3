require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dark Souls Wiki API is running' });
});

// Import routes
const authRoutes = require('./routes/auth');
const bossRoutes = require('./routes/bosses');
const commentRoutes = require('./routes/comments');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/bosses', bossRoutes);
app.use('/api/comments', commentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Dark Souls Wiki API running on port ${PORT}`);
});
