const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const bfhlRoutes = require('./routes/bfhl.routes');
const healthRoutes = require('./routes/health.routes');

// Create Express application
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

// Rate limiting (adjusted for serverless)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT) || 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks in production
    return process.env.NODE_ENV === 'production' && req.path === '/health';
  }
});
app.use(limiter);

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing middleware
app.use(express.json({ 
  limit: process.env.JSON_LIMIT || '10mb',
  strict: true
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.URL_ENCODED_LIMIT || '10mb'
}));

// Request timeout middleware
app.use((req, res, next) => {
  res.setTimeout(parseInt(process.env.REQUEST_TIMEOUT) || 30000, () => {
    res.status(408).json({
      error: 'Request timeout',
      message: 'The request took too long to process'
    });
  });
  next();
});

// Register routes
app.use('/health', healthRoutes);
app.use('/bfhl', bfhlRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'BAJAJ API Server',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Centralized error handling middleware
app.use((error, req, res, next) => {
  // Log error
  console.error('Error occurred:', {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Handle different error types
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
  } else if (error.status) {
    statusCode = error.status;
    message = error.message;
  } else if (error.message) {
    message = error.message;
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    }),
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process in production unless critical
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;