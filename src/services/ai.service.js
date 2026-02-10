const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Analysis Service
 * Provides intelligent data analysis and insights using Google Gemini API
 */

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiService = {
  /**
   * Get single-word analysis using Google Gemini API
   */
  async getSingleWordAnalysis(data) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY not found in environment variables');
        return 'unavailable';
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Analyze this data and provide ONLY ONE WORD that best describes the overall pattern or characteristic: ${JSON.stringify(data)}
      
      Rules:
      - Return ONLY one word (no explanations, no punctuation)
      - Choose from: ascending, descending, random, sequential, clustered, sparse, balanced, unbalanced, simple, complex, ordered, chaotic, uniform, diverse, numeric, alphabetic, mixed, sorted, unsorted, positive, negative, even, odd, prime, composite, fibonacci, arithmetic, geometric, exponential, linear, cyclical, repeating, unique, duplicate, ascending, descending, increasing, decreasing, stable, volatile, concentrated, distributed, regular, irregular, symmetric, asymmetric, continuous, discrete, dense, scattered, organized, disorganized, structured, unstructured, consistent, inconsistent, logical, illogical, predictable, unpredictable
      
      Data to analyze: Numbers: ${data.numbers || []}, Alphabets: ${data.alphabets || []}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim().toLowerCase();
      
      // Ensure single word response
      const singleWord = text.split(/\s+/)[0].replace(/[^a-z]/g, '');
      
      return singleWord || 'complex';
      
    } catch (error) {
      console.error('Gemini API error:', error.message);
      return 'error';
    }
  },

  /**
   * Get AI sentiment analysis as single word
   */
  async getDataSentiment(analysisData) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return 'neutral';
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Based on this data analysis, provide ONLY ONE WORD describing the data sentiment or trend:
      
      Data summary:
      - Numbers count: ${analysisData.numbers?.length || 0}
      - Alphabets count: ${analysisData.alphabets?.length || 0}
      - Has mathematical patterns: ${analysisData.mathResults ? 'yes' : 'no'}
      - File included: ${analysisData.fileInfo?.file_valid ? 'yes' : 'no'}
      
      Return only one word from: positive, negative, neutral, optimistic, pessimistic, stable, volatile, growing, declining, strong, weak, healthy, unhealthy, balanced, imbalanced, efficient, inefficient, clear, unclear, good, bad, excellent, poor, average, outstanding, concerning, promising, steady, turbulent, consistent, erratic, reliable, unreliable, robust, fragile, dynamic, static`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim().toLowerCase();
      
      const singleWord = text.split(/\s+/)[0].replace(/[^a-z]/g, '');
      return singleWord || 'neutral';
      
    } catch (error) {
      console.error('Gemini sentiment analysis error:', error.message);
      return 'unknown';
    }
  },

  /**
   * Get AI recommendation as single word
   */
  async getAIRecommendation(analysisData) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return 'optimize';
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Given this data analysis, provide ONLY ONE WORD as the top recommendation:
      
      Analysis context:
      - Data complexity: ${analysisData.complexity || 'unknown'}
      - Quality score: ${analysisData.quality || 'unknown'}
      - Pattern type: ${analysisData.patterns || 'unknown'}
      
      Return only one word from: optimize, simplify, expand, reduce, validate, restructure, normalize, standardize, clean, filter, sort, group, analyze, visualize, process, store, backup, secure, encrypt, compress, index, search, aggregate, summarize, detail, focus, broaden, deepen, investigate, explore, monitor, track, measure, evaluate, improve, enhance, refactor, redesign, rebuild, maintain, update, upgrade, downgrade, scale, balance, stabilize, accelerate, decelerate, automate, customize, integrate, separate, combine, divide, merge, split`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim().toLowerCase();
      
      const singleWord = text.split(/\s+/)[0].replace(/[^a-z]/g, '');
      return singleWord || 'optimize';
      
    } catch (error) {
      console.error('Gemini recommendation error:', error.message);
      return 'review';
    }
  },
  /**
   * Analyze data patterns and provide insights
   */
  async analyzeData(analysisData) {
    try {
      const { numbers, alphabets, mathResults, fileInfo } = analysisData;
      const startTime = Date.now();
      
      // Get AI-powered single-word insights
      const [geminiAnalysis, geminiSentiment, geminiRecommendation] = await Promise.all([
        this.getSingleWordAnalysis({ numbers, alphabets }),
        this.getDataSentiment(analysisData),
        this.getAIRecommendation(analysisData)
      ]);
      
      const insights = {
        // AI-powered single-word insights
        ai_powered_insights: {
          gemini_analysis: geminiAnalysis,
          data_sentiment: geminiSentiment,
          ai_recommendation: geminiRecommendation,
          ai_confidence: this.calculateAIConfidence(geminiAnalysis, geminiSentiment, geminiRecommendation)
        },
        
        // Traditional analysis
        data_complexity: this.assessDataComplexity(numbers, alphabets),
        pattern_detection: await this.detectPatterns(numbers, alphabets),
        data_quality: this.assessDataQuality(numbers, alphabets),
        recommendations: await this.generateRecommendations(analysisData),
        anomaly_detection: this.detectAnomalies(numbers),
        text_analysis: this.analyzeTextData(alphabets),
        numerical_insights: this.analyzeNumericalData(numbers, mathResults),
        file_insights: fileInfo?.file_valid ? this.analyzeFileData(fileInfo) : null,
        confidence_score: this.calculateConfidenceScore(analysisData),
        
        processing_metadata: {
          analysis_timestamp: new Date().toISOString(),
          algorithm_version: '2.0.0',
          gemini_integration: true,
          analysis_duration_ms: Date.now() - startTime,
          api_status: process.env.GEMINI_API_KEY ? 'enabled' : 'disabled'
        }
      };
      
      return insights;
    } catch (error) {
      console.error('AI analysis error:', error);
      return {
        error: 'AI analysis failed',
        ai_powered_insights: {
          gemini_analysis: 'error',
          data_sentiment: 'unknown',
          ai_recommendation: 'retry',
          ai_confidence: 0
        },
        fallback_insights: this.generateBasicInsights(analysisData)
      };
    }
  },

  /**
   * Calculate AI confidence based on response quality
   */
  calculateAIConfidence(analysis, sentiment, recommendation) {
    let confidence = 0.5; // Base confidence
    
    // Valid single-word responses increase confidence
    if (analysis && analysis !== 'error' && analysis !== 'unavailable') confidence += 0.2;
    if (sentiment && sentiment !== 'unknown' && sentiment !== 'error') confidence += 0.15;
    if (recommendation && recommendation !== 'retry' && recommendation !== 'error') confidence += 0.15;
    
    return Math.min(1.0, confidence);
  },
  
  /**
   * Assess complexity of input data
   */
  assessDataComplexity(numbers, alphabets) {
    const totalElements = numbers.length + alphabets.length;
    const uniqueNumbers = new Set(numbers).size;
    const uniqueAlphabets = new Set(alphabets).size;
    
    let complexity = 'low';
    let score = 0;
    
    // Scoring factors
    if (totalElements > 50) score += 3;
    else if (totalElements > 20) score += 2;
    else if (totalElements > 10) score += 1;
    
    if (numbers.length > 0) {
      const range = Math.max(...numbers) - Math.min(...numbers);
      if (range > 1000) score += 2;
      else if (range > 100) score += 1;
    }
    
    const diversityRatio = (uniqueNumbers + uniqueAlphabets) / totalElements;
    if (diversityRatio > 0.8) score += 2;
    else if (diversityRatio > 0.5) score += 1;
    
    if (score >= 6) complexity = 'high';
    else if (score >= 3) complexity = 'medium';
    
    return {
      level: complexity,
      score: score,
      factors: {
        data_size: totalElements,
        number_diversity: uniqueNumbers / (numbers.length || 1),
        alphabet_diversity: uniqueAlphabets / (alphabets.length || 1),
        numerical_range: numbers.length > 0 ? Math.max(...numbers) - Math.min(...numbers) : 0
      }
    };
  },
  
  /**
   * Detect patterns in data
   */
  async detectPatterns(numbers, alphabets) {
    const patterns = {
      numerical_patterns: [],
      alphabetical_patterns: [],
      sequence_analysis: {}
    };
    
    // Numerical pattern detection
    if (numbers.length >= 3) {
      patterns.numerical_patterns.push(...this.detectNumericalPatterns(numbers));
    }
    
    // Alphabetical pattern detection
    if (alphabets.length >= 3) {
      patterns.alphabetical_patterns.push(...this.detectAlphabeticalPatterns(alphabets));
    }
    
    // Sequence analysis
    patterns.sequence_analysis = {
      is_arithmetic: this.isArithmeticSequence(numbers),
      is_geometric: this.isGeometricSequence(numbers),
      is_alphabetical: this.isAlphabeticalSequence(alphabets),
      has_repetition: this.hasRepeatingPattern(numbers.concat(alphabets))
    };
    
    return patterns;
  },
  
  /**
   * Detect numerical patterns
   */
  detectNumericalPatterns(numbers) {
    const patterns = [];
    
    // Check for even/odd dominance
    const evenCount = numbers.filter(n => n % 2 === 0).length;
    const oddCount = numbers.length - evenCount;
    
    if (evenCount > oddCount * 2) {
      patterns.push({ type: 'even_dominance', confidence: 0.8 });
    } else if (oddCount > evenCount * 2) {
      patterns.push({ type: 'odd_dominance', confidence: 0.8 });
    }
    
    // Check for ascending/descending trends
    let ascending = 0, descending = 0;
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] > numbers[i-1]) ascending++;
      else if (numbers[i] < numbers[i-1]) descending++;
    }
    
    if (ascending > descending * 1.5) {
      patterns.push({ type: 'ascending_trend', confidence: ascending / (numbers.length - 1) });
    } else if (descending > ascending * 1.5) {
      patterns.push({ type: 'descending_trend', confidence: descending / (numbers.length - 1) });
    }
    
    return patterns;
  },
  
  /**
   * Detect alphabetical patterns
   */
  detectAlphabeticalPatterns(alphabets) {
    const patterns = [];
    
    // Check for case patterns
    const uppercaseCount = alphabets.filter(c => c === c.toUpperCase()).length;
    const lowercaseCount = alphabets.length - uppercaseCount;
    
    if (uppercaseCount > lowercaseCount * 2) {
      patterns.push({ type: 'uppercase_dominance', confidence: 0.8 });
    } else if (lowercaseCount > uppercaseCount * 2) {
      patterns.push({ type: 'lowercase_dominance', confidence: 0.8 });
    }
    
    // Check for vowel/consonant patterns
    const vowels = alphabets.filter(c => 'aeiouAEIOU'.includes(c)).length;
    const consonants = alphabets.length - vowels;
    
    if (vowels > consonants) {
      patterns.push({ type: 'vowel_heavy', confidence: vowels / alphabets.length });
    }
    
    return patterns;
  },
  
  /**
   * Check if numbers form arithmetic sequence
   */
  isArithmeticSequence(numbers) {
    if (numbers.length < 2) return false;
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const diff = sorted[1] - sorted[0];
    
    for (let i = 2; i < sorted.length; i++) {
      if (sorted[i] - sorted[i-1] !== diff) return false;
    }
    
    return true;
  },
  
  /**
   * Check if numbers form geometric sequence
   */
  isGeometricSequence(numbers) {
    if (numbers.length < 2 || numbers.some(n => n === 0)) return false;
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const ratio = sorted[1] / sorted[0];
    
    for (let i = 2; i < sorted.length; i++) {
      if (Math.abs(sorted[i] / sorted[i-1] - ratio) > 0.0001) return false;
    }
    
    return true;
  },
  
  /**
   * Check if alphabets form alphabetical sequence
   */
  isAlphabeticalSequence(alphabets) {
    if (alphabets.length < 2) return false;
    
    const codes = alphabets.map(c => c.charCodeAt(0)).sort((a, b) => a - b);
    
    for (let i = 1; i < codes.length; i++) {
      if (codes[i] - codes[i-1] !== 1) return false;
    }
    
    return true;
  },
  
  /**
   * Check for repeating patterns
   */
  hasRepeatingPattern(data) {
    const str = data.join('');
    for (let len = 1; len <= str.length / 2; len++) {
      const pattern = str.substring(0, len);
      if (str === pattern.repeat(Math.floor(str.length / len))) {
        return { pattern, length: len };
      }
    }
    return false;
  },
  
  /**
   * Assess data quality
   */
  assessDataQuality(numbers, alphabets) {
    const quality = {
      completeness: 1.0, // Assuming all data is present
      consistency: this.assessConsistency(numbers, alphabets),
      validity: this.assessValidity(numbers, alphabets),
      uniqueness: this.assessUniqueness(numbers, alphabets),
      overall_score: 0
    };
    
    quality.overall_score = (quality.completeness + quality.consistency + quality.validity + quality.uniqueness) / 4;
    
    return quality;
  },
  
  /**
   * Assess data consistency
   */
  assessConsistency(numbers, alphabets) {
    // Check for type consistency and reasonable ranges
    let score = 1.0;
    
    if (numbers.some(n => !Number.isFinite(n))) score -= 0.3;
    if (numbers.some(n => Math.abs(n) > 1e10)) score -= 0.2;
    if (alphabets.some(a => a.length !== 1)) score -= 0.3;
    
    return Math.max(0, score);
  },
  
  /**
   * Assess data validity
   */
  assessValidity(numbers, alphabets) {
    // All data passed validation to reach here
    return 1.0;
  },
  
  /**
   * Assess data uniqueness
   */
  assessUniqueness(numbers, alphabets) {
    const totalElements = numbers.length + alphabets.length;
    const uniqueElements = new Set([...numbers, ...alphabets]).size;
    
    return uniqueElements / totalElements;
  },
  
  /**
   * Generate recommendations based on analysis
   */
  async generateRecommendations(analysisData) {
    const { numbers, alphabets, mathResults } = analysisData;
    const recommendations = [];
    
    // Data processing recommendations
    if (numbers.length > alphabets.length * 3) {
      recommendations.push({
        category: 'data_processing',
        suggestion: 'Consider separate numerical analysis pipeline',
        priority: 'medium'
      });
    }
    
    // Performance recommendations  
    if (numbers.length > 100) {
      recommendations.push({
        category: 'performance',
        suggestion: 'Implement batch processing for large datasets',
        priority: 'high'
      });
    }
    
    // Mathematical analysis recommendations
    if (mathResults && mathResults.primes && mathResults.primes.length > 0) {
      recommendations.push({
        category: 'analysis',
        suggestion: 'Prime numbers detected - consider cryptographic applications',
        priority: 'low'
      });
    }
    
    return recommendations;
  },
  
  /**
   * Detect anomalies in numerical data
   */
  detectAnomalies(numbers) {
    if (numbers.length < 3) return { anomalies: [], method: 'insufficient_data' };
    
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const stdDev = Math.sqrt(numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / numbers.length);
    
    const anomalies = numbers.filter(num => Math.abs(num - mean) > 2 * stdDev);
    
    return {
      anomalies,
      method: 'statistical_outlier',
      threshold: 2 * stdDev,
      statistics: { mean, stdDev }
    };
  },
  
  /**
   * Analyze text/alphabetical data
   */
  analyzeTextData(alphabets) {
    return {
      character_frequency: this.getCharacterFrequency(alphabets),
      case_distribution: {
        uppercase: alphabets.filter(c => c === c.toUpperCase()).length,
        lowercase: alphabets.filter(c => c === c.toLowerCase()).length
      },
      vowel_consonant_ratio: this.getVowelConsonantRatio(alphabets)
    };
  },
  
  /**
   * Get character frequency
   */
  getCharacterFrequency(alphabets) {
    const frequency = {};
    alphabets.forEach(char => {
      frequency[char] = (frequency[char] || 0) + 1;
    });
    return frequency;
  },
  
  /**
   * Get vowel to consonant ratio
   */
  getVowelConsonantRatio(alphabets) {
    const vowels = alphabets.filter(c => 'aeiouAEIOU'.includes(c)).length;
    const consonants = alphabets.length - vowels;
    return consonants > 0 ? vowels / consonants : vowels;
  },
  
  /**
   * Analyze numerical data insights
   */
  analyzeNumericalData(numbers, mathResults) {
    if (numbers.length === 0) return null;
    
    return {
      distribution_analysis: {
        is_normal: this.assessNormalDistribution(numbers),
        skewness: this.calculateSkewness(numbers),
        kurtosis: this.calculateKurtosis(numbers)
      },
      mathematical_properties: mathResults || {},
      clustering_hints: this.detectClusters(numbers)
    };
  },
  
  /**
   * Assess if data follows normal distribution (simplified)
   */
  assessNormalDistribution(numbers) {
    // Simplified normality test - in production, use proper statistical tests
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const median = [...numbers].sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
    
    return Math.abs(mean - median) < Math.abs(mean) * 0.1;
  },
  
  /**
   * Calculate skewness
   */
  calculateSkewness(numbers) {
    const n = numbers.length;
    const mean = numbers.reduce((a, b) => a + b, 0) / n;
    const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) return 0;
    
    const skewness = numbers.reduce((acc, num) => acc + Math.pow((num - mean) / stdDev, 3), 0) / n;
    return skewness;
  },
  
  /**
   * Calculate kurtosis
   */
  calculateKurtosis(numbers) {
    const n = numbers.length;
    const mean = numbers.reduce((a, b) => a + b, 0) / n;
    const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) return 0;
    
    const kurtosis = numbers.reduce((acc, num) => acc + Math.pow((num - mean) / stdDev, 4), 0) / n;
    return kurtosis - 3; // Excess kurtosis
  },
  
  /**
   * Detect potential clusters in data
   */
  detectClusters(numbers) {
    if (numbers.length < 3) return [];
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const gaps = [];
    
    for (let i = 1; i < sorted.length; i++) {
      gaps.push(sorted[i] - sorted[i-1]);
    }
    
    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const largeGaps = gaps.filter(gap => gap > avgGap * 2);
    
    return {
      potential_clusters: largeGaps.length + 1,
      gap_analysis: { average_gap: avgGap, large_gaps: largeGaps.length }
    };
  },
  
  /**
   * Analyze file data
   */
  analyzeFileData(fileInfo) {
    return {
      type_category: this.categorizeFileType(fileInfo.file_mime_type),
      size_category: this.categorizeFileSize(fileInfo.file_size_kb),
      recommendations: this.getFileRecommendations(fileInfo)
    };
  },
  
  /**
   * Categorize file type
   */
  categorizeFileType(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('text/')) return 'text';
    if (mimeType.includes('json')) return 'data';
    if (mimeType.includes('pdf')) return 'document';
    return 'binary';
  },
  
  /**
   * Categorize file size
   */
  categorizeFileSize(sizeKb) {
    if (sizeKb < 10) return 'small';
    if (sizeKb < 100) return 'medium';
    if (sizeKb < 1000) return 'large';
    return 'very_large';
  },
  
  /**
   * Get file recommendations
   */
  getFileRecommendations(fileInfo) {
    const recommendations = [];
    
    if (fileInfo.file_size_kb > 1000) {
      recommendations.push('Consider file compression');
    }
    
    if (fileInfo.file_mime_type === 'application/octet-stream') {
      recommendations.push('File type unclear - consider adding file extension');
    }
    
    return recommendations;
  },
  
  /**
   * Calculate overall confidence score
   */
  calculateConfidenceScore(analysisData) {
    const { numbers, alphabets, fileInfo } = analysisData;
    
    let score = 0.5; // Base score
    
    // Data quantity factors
    if (numbers.length + alphabets.length > 10) score += 0.2;
    if (numbers.length > 0 && alphabets.length > 0) score += 0.1;
    
    // Data quality factors
    if (new Set([...numbers, ...alphabets]).size === numbers.length + alphabets.length) {
      score += 0.1; // All unique
    }
    
    // File processing factors
    if (fileInfo && fileInfo.file_valid) score += 0.1;
    
    return Math.min(1.0, score);
  },
  
  /**
   * Generate basic insights as fallback
   */
  generateBasicInsights(analysisData) {
    const { numbers, alphabets } = analysisData;
    
    return {
      summary: `Processed ${numbers.length} numbers and ${alphabets.length} alphabets`,
      basic_stats: {
        total_elements: numbers.length + alphabets.length,
        numerical_elements: numbers.length,
        alphabetical_elements: alphabets.length
      },
      ai_powered_insights: {
        gemini_analysis: 'unavailable',
        data_sentiment: 'neutral',
        ai_recommendation: 'configure',
        ai_confidence: 0,
        note: 'Gemini API not configured - set GEMINI_API_KEY environment variable'
      },
      note: 'Advanced AI analysis unavailable - showing basic insights'
    };
  },

  /**
   * Test Gemini API connectivity
   */
  async testGeminiConnection() {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return {
          connected: false,
          error: 'GEMINI_API_KEY not configured'
        };
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('Respond with only the word "connected"');
      const response = await result.response;
      const text = response.text().trim().toLowerCase();
      
      return {
        connected: text === 'connected',
        status: text === 'connected' ? 'operational' : 'responsive',
        response: text
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  },

  /**
   * Validate API configuration
   */
  validateAPIConfig() {
    const config = {
      api_key_configured: !!process.env.GEMINI_API_KEY,
      api_key_valid: false,
      recommendations: []
    };

    if (!config.api_key_configured) {
      config.recommendations.push('Set GEMINI_API_KEY environment variable');
    } else {
      // Basic API key format validation
      const apiKey = process.env.GEMINI_API_KEY;
      config.api_key_valid = apiKey.length > 20 && apiKey.startsWith('AIza');
      
      if (!config.api_key_valid) {
        config.recommendations.push('Verify GEMINI_API_KEY format (should start with AIza)');
      }
    }

    return config;
  }
};

module.exports = aiService;
