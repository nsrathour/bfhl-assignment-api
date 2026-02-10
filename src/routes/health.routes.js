const express = require('express');
const healthController = require('../controllers/health.controller');

const router = express.Router();

// GET /health - Health check endpoint
router.get('/', healthController.getHealth);

module.exports = router;
