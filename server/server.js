import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import poemRoutes from './routes/poemRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration: supports local dev and production frontend
const devOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, '') : null;
const allowedOrigins = frontendUrl ? [...devOrigins, frontendUrl] : devOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// Root Status Endpoint for Platform Health Checkers
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'SENGAANTHAL REST API',
    status: 'online',
    version: '1.0.0'
  });
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SENGAANTHAL API is operational',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/poems', poemRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`
  });
});

// Centralized error handling middleware
app.use((err, req, res, _next) => {
  console.error('[Unhandled Server Error]:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred'
  });
});

// Start Server and verify DB connection
async function startServer() {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.warn('[Warning] PostgreSQL connection could not be established at launch. Ensure PostgreSQL or DATABASE_URL is accessible.');
  }

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  SENGAANTHAL REST API Server running on port ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

startServer();
