const os = require('os');
const process = require('process');

/**
 * Health Check Controller
 * Provides application health status and system information
 */
const healthController = {
  /**
   * GET /health - Health check endpoint
   * Returns application status and system information
   */
  getHealth: async (req, res) => {
    try {
      const startTime = process.hrtime();
      
      // Get current timestamp
      const timestamp = new Date().toISOString();
      
      // Calculate uptime
      const uptimeSeconds = process.uptime();
      const uptimeFormatted = formatUptime(uptimeSeconds);
      
      // Get memory usage
      const memoryUsage = process.memoryUsage();
      const memoryInfo = {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100} MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`
      };
      
      // Get system information
      const systemInfo = {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        totalMemory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024 * 100) / 100} GB`,
        freeMemory: `${Math.round(os.freemem() / 1024 / 1024 / 1024 * 100) / 100} GB`,
        cpuCount: os.cpus().length,
        loadAverage: os.loadavg()
      };
      
      // Check database connectivity (placeholder - implement if using database)
      const dbStatus = await checkDatabaseHealth();
      
      // Check external services (placeholder - implement if using external APIs)
      const externalServices = await checkExternalServices();
      
      // Calculate response time
      const endTime = process.hrtime(startTime);
      const responseTimeMs = Math.round((endTime[0] * 1000 + endTime[1] * 1e-6) * 100) / 100;
      
      // Determine overall health status
      const isHealthy = dbStatus.healthy && externalServices.healthy;
      const status = isHealthy ? 'healthy' : 'degraded';
      const statusCode = isHealthy ? 200 : 503;
      
      // Build response
      const healthResponse = {
        status: status,
        timestamp: timestamp,
        uptime: uptimeFormatted,
        responseTime: `${responseTimeMs}ms`,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        server: {
          name: 'BAJAJ API Server',
          pid: process.pid,
          memory: memoryInfo,
          system: systemInfo
        },
        dependencies: {
          database: dbStatus,
          externalServices: externalServices
        },
        metrics: {
          requestCount: getRequestCount(),
          errorRate: getErrorRate(),
          averageResponseTime: getAverageResponseTime()
        }
      };
      
      // Set cache headers to prevent caching of health status
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.status(statusCode).json(healthResponse);
      
    } catch (error) {
      console.error('Health check error:', error);
      
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable'
      });
    }
  }
};

/**
 * Format uptime in human readable format
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);
  
  return parts.join(' ') || '0s';
}

/**
 * Check database health
 * Implement actual database connectivity check here
 */
async function checkDatabaseHealth() {
  try {
    // Placeholder - implement actual database check
    // Example: await db.raw('SELECT 1');
    
    return {
      healthy: true,
      status: 'connected',
      responseTime: '<5ms'
    };
  } catch (error) {
    return {
      healthy: false,
      status: 'disconnected',
      error: error.message
    };
  }
}

/**
 * Check external services health
 * Implement actual external service checks here
 */
async function checkExternalServices() {
  try {
    // Placeholder - implement actual external service checks
    // Example: check APIs, Redis, etc.
    
    return {
      healthy: true,
      services: {
        // redis: { status: 'connected', responseTime: '<2ms' },
        // api: { status: 'available', responseTime: '<100ms' }
      }
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

/**
 * Get request count (implement with actual metrics)
 */
function getRequestCount() {
  // Placeholder - implement with actual request counter
  return process.env.REQUEST_COUNT || 0;
}

/**
 * Get error rate (implement with actual metrics)
 */
function getErrorRate() {
  // Placeholder - implement with actual error tracking
  return process.env.ERROR_RATE || '0%';
}

/**
 * Get average response time (implement with actual metrics)
 */
function getAverageResponseTime() {
  // Placeholder - implement with actual response time tracking
  return process.env.AVG_RESPONSE_TIME || '<50ms';
}

module.exports = healthController;
