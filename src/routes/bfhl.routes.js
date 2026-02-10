const express = require('express');
const bfhlController = require('../controllers/bfhl.controller');

const router = express.Router();

// Validation middleware for POST /bfhl
const validateBfhlRequest = (req, res, next) => {
  try {
    const { data, file_b64 } = req.body;

    // Check if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        is_success: false,
        error: 'Request body is required'
      });
    }

    // Validate data field
    if (!data) {
      return res.status(400).json({
        is_success: false,
        error: 'data field is required'
      });
    }

    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: 'data must be an array'
      });
    }

    if (data.length === 0) {
      return res.status(400).json({
        is_success: false,
        error: 'data array cannot be empty'
      });
    }

    // Validate each element in data array
    const invalidElements = data.filter(item => 
      typeof item !== 'string' && typeof item !== 'number'
    );

    if (invalidElements.length > 0) {
      return res.status(400).json({
        is_success: false,
        error: 'data array must contain only strings and numbers'
      });
    }

    // Validate file_b64 if provided
    if (file_b64 !== undefined) {
      if (typeof file_b64 !== 'string') {
        return res.status(400).json({
          is_success: false,
          error: 'file_b64 must be a string'
        });
      }

      // Basic base64 validation
      if (file_b64 && !/^[A-Za-z0-9+/]*={0,2}$/.test(file_b64)) {
        return res.status(400).json({
          is_success: false,
          error: 'file_b64 is not a valid base64 string'
        });
      }

      // Check base64 length (optional - prevent extremely large files)
      const maxFileSize = 10 * 1024 * 1024; // 10MB in base64
      if (file_b64.length > maxFileSize) {
        return res.status(400).json({
          is_success: false,
          error: 'file_b64 exceeds maximum allowed size'
        });
      }
    }

    // Additional validation: check for reasonable array size
    if (data.length > 1000) {
      return res.status(400).json({
        is_success: false,
        error: 'data array exceeds maximum allowed length of 1000 elements'
      });
    }

    // Validate string lengths
    const invalidStrings = data.filter(item => 
      typeof item === 'string' && item.length > 100
    );

    if (invalidStrings.length > 0) {
      return res.status(400).json({
        is_success: false,
        error: 'string elements in data array cannot exceed 100 characters'
      });
    }

    // Validate number ranges
    const invalidNumbers = data.filter(item => 
      typeof item === 'number' && (item < -999999999 || item > 999999999 || !Number.isFinite(item))
    );

    if (invalidNumbers.length > 0) {
      return res.status(400).json({
        is_success: false,
        error: 'number elements must be finite and between -999999999 and 999999999'
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      is_success: false,
      error: 'Invalid JSON payload'
    });
  }
};

// Content-Type validation middleware
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(400).json({
      is_success: false,
      error: 'Content-Type must be application/json'
    });
  }
  next();
};

// Rate limiting for POST endpoint (more restrictive)
const postRateLimit = require('express-rate-limit')({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit to 10 requests per minute for POST
  message: {
    is_success: false,
    error: 'Too many POST requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /bfhl - Main processing endpoint
router.post('/', 
  validateContentType,
  postRateLimit,
  validateBfhlRequest,
  bfhlController.processBfhl
);

// GET /bfhl - Operation code endpoint
router.get('/', bfhlController.getOperationCode);

module.exports = router;
