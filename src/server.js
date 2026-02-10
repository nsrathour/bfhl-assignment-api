const app = require('./app');
require('dotenv').config();

// Get port from environment variables with fallback
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

let server;

// Start server function
const startServer = () => {
  try {
    server = app.listen(PORT, HOST, () => {
      console.log(`Server running on ${HOST}:${PORT}`);
      console.log(`Started at: ${new Date().toISOString()}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API URL: http://${HOST}:${PORT}`);
      console.log(`Health Check: http://${HOST}:${PORT}/api/health`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`ERROR: Port ${PORT} is already in use`);
        console.error('Please try a different port or stop the process using this port');
      } else if (error.code === 'EACCES') {
        console.error(`ERROR: Permission denied to bind to port ${PORT}`);
        console.error('Try using a port number above 1024 or run with elevated privileges');
      } else {
        console.error('ERROR: Server error:', error.message);
      }
      process.exit(1);
    });

    // Handle server startup timeout
    const startupTimeout = setTimeout(() => {
      console.error('ERROR: Server startup timeout');
      process.exit(1);
    }, 10000); // 10 second timeout

    server.on('listening', () => {
      clearTimeout(startupTimeout);
      console.log('SUCCESS: Server is ready to accept connections');
    });

  } catch (error) {
    console.error('ERROR: Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown function
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
  if (server) {
    server.close((err) => {
      if (err) {
        console.error('ERROR: Error during server shutdown:', err.message);
        process.exit(1);
      }
      
      console.log('Server closed successfully');
      console.log('Goodbye!');
      process.exit(0);
    });

    // Force shutdown after timeout
    setTimeout(() => {
      console.error('ERROR: Forced shutdown due to timeout');
      process.exit(1);
    }, 10000); // 10 second timeout for graceful shutdown
  } else {
    process.exit(0);
  }
};

// Handle process signals for graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('ERROR: Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('ERROR: Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Validate environment before starting
const validateEnvironment = () => {
  const requiredEnvVars = [];
  
 
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    console.error('ERROR: Missing required environment variables:');
    missingEnvVars.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    process.exit(1);
  }
  
  return true;
};

// Start the server
if (require.main === module) {
  console.log('Validating environment...');
  validateEnvironment();
  
  console.log('Starting BAJAJ API Server...');
  startServer();
}

// Export for testing
module.exports = { app, startServer, gracefulShutdown };