const mathService = require('../services/math.service');
const aiService = require('../services/ai.service');

/**
 * BFHL Controller
 * Handles business logic for BFHL API endpoints
 */
const bfhlController = {
  /**
   * POST /bfhl - Process data with mathematical and AI operations
   */
  processBfhl: async (req, res) => {
    try {
      const { data, file_b64 } = req.body;
      const startTime = process.hrtime();
      
      // Process data array to separate numbers and alphabets
      const numbers = [];
      const alphabets = [];
      const lowercaseAlphabets = [];
      
      for (const item of data) {
        const stringItem = String(item);
        
        // Check if it's a number
        if (!isNaN(item) && !isNaN(parseFloat(item))) {
          numbers.push(Number(item));
        }
        // Check if it's alphabetic
        else if (/^[a-zA-Z]$/.test(stringItem)) {
          alphabets.push(stringItem);
          if (/^[a-z]$/.test(stringItem)) {
            lowercaseAlphabets.push(stringItem);
          }
        }
      }
      
      // Find highest lowercase alphabet
      const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 
        ? [lowercaseAlphabets.sort().pop()] 
        : [];
      
      // Mathematical operations on numbers
      let mathResults = {};
      if (numbers.length > 0) {
        mathResults = {
          sum: numbers.reduce((a, b) => a + b, 0),
          product: numbers.reduce((a, b) => a * b, 1),
          max: Math.max(...numbers),
          min: Math.min(...numbers),
          average: numbers.reduce((a, b) => a + b, 0) / numbers.length,
          fibonacci: await mathService.getFibonacciSequence(Math.max(...numbers)),
          primes: await mathService.getPrimeNumbers(numbers),
          lcm: numbers.length > 1 ? await mathService.calculateLCM(numbers) : null,
          hcf: numbers.length > 1 ? await mathService.calculateHCF(numbers) : null
        };
      }
      
      // File processing
      let fileInfo = {
        file_valid: false,
        file_mime_type: null,
        file_size_kb: null
      };
      
      if (file_b64) {
        try {
          fileInfo = await processFile(file_b64);
        } catch (error) {
          console.error('File processing error:', error.message);
        }
      }
      
      // AI Processing
      let aiAnalysis = {};
      try {
        aiAnalysis = await aiService.analyzeData({
          numbers,
          alphabets,
          mathResults,
          fileInfo
        });
      } catch (error) {
        console.error('AI analysis error:', error.message);
        aiAnalysis = { error: 'AI analysis unavailable' };
      }
      
      // Calculate processing time
      const endTime = process.hrtime(startTime);
      const processingTimeMs = Math.round((endTime[0] * 1000 + endTime[1] * 1e-6) * 100) / 100;
      
      // Build response according to BFHL specification
      const response = {
        is_success: true,
        user_id: generateUserId(),
        email: process.env.USER_EMAIL || "john_doe_17091999@gmail.com",
        roll_number: process.env.ROLL_NUMBER || "ABCD123",
        numbers: numbers.map(String),
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        ...fileInfo,
        
        // Highlighted Gemini AI single-word insights
        gemini_ai_insights: aiAnalysis.ai_powered_insights || {
          gemini_analysis: 'unavailable',
          data_sentiment: 'neutral',
          ai_recommendation: 'configure'
        },
        
        analytics: {
          processing_time_ms: processingTimeMs,
          data_count: data.length,
          numbers_count: numbers.length,
          alphabets_count: alphabets.length,
          mathematical_operations: mathResults,
          ai_insights: aiAnalysis,
          
          // Quick summary with AI insights
          summary: {
            pattern_detected: aiAnalysis.ai_powered_insights?.gemini_analysis || 'unknown',
            data_sentiment: aiAnalysis.ai_powered_insights?.data_sentiment || 'neutral',
            recommended_action: aiAnalysis.ai_powered_insights?.ai_recommendation || 'analyze',
            ai_confidence: aiAnalysis.ai_powered_insights?.ai_confidence || 0,
            gemini_enabled: !!process.env.GEMINI_API_KEY
          }
        }
      };
      
      res.status(200).json(response);
      
    } catch (error) {
      console.error('BFHL processing error:', error);
      
      res.status(500).json({
        is_success: false,
        error: 'Processing failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  },
  
  /**
   * GET /bfhl - Get operation code
   */
  getOperationCode: async (req, res) => {
    try {
      const response = {
        is_success: true,
        official_email: process.env.USER_EMAIL || "john_doe_17091999@gmail.com"
      };
      
      res.status(200).json(response);
      
    } catch (error) {
      console.error('Operation code error:', error);
      
      res.status(500).json({
        is_success: false,
        error: 'Failed to retrieve operation code'
      });
    }
  }
};

/**
 * Process base64 file and extract information
 */
async function processFile(file_b64) {
  try {
    // Decode base64
    const buffer = Buffer.from(file_b64, 'base64');
    
    // Calculate file size in KB
    const fileSizeKb = Math.round((buffer.length / 1024) * 100) / 100;
    
    // Detect MIME type based on file signature
    const mimeType = detectMimeType(buffer);
    
    // Validate file
    const isValid = mimeType !== null && buffer.length > 0;
    
    return {
      file_valid: isValid,
      file_mime_type: mimeType,
      file_size_kb: fileSizeKb
    };
    
  } catch (error) {
    throw new Error(`File processing failed: ${error.message}`);
  }
}

/**
 * Detect MIME type from file buffer
 */
function detectMimeType(buffer) {
  if (buffer.length === 0) return null;
  
  // Check file signatures
  const signatures = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'application/pdf': [0x25, 0x50, 0x44, 0x46],
    'text/plain': null, // Default for text files
    'application/json': null,
    'text/csv': null
  };
  
  for (const [mimeType, signature] of Object.entries(signatures)) {
    if (signature === null) continue;
    
    if (signature.every((byte, index) => buffer[index] === byte)) {
      return mimeType;
    }
  }
  
  // Check if it's likely text
  const isLikelyText = buffer.every(byte => 
    (byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13
  );
  
  if (isLikelyText) {
    const content = buffer.toString('utf8');
    try {
      JSON.parse(content);
      return 'application/json';
    } catch {
      return content.includes(',') ? 'text/csv' : 'text/plain';
    }
  }
  
  return 'application/octet-stream';
}

/**
 * Generate unique user ID based on timestamp and random components
 */
function generateUserId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  const email = process.env.USER_EMAIL || "john_doe_17091999";
  const emailPart = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  
  return `${emailPart}_${timestamp}_${random}`;
}

module.exports = bfhlController;
