/**
 * Mathematical Operations Service
 * Provides mathematical computations for BFHL operations
 */
const mathService = {
  /**
   * Generate Fibonacci sequence up to a given number
   */
  async getFibonacciSequence(maxValue) {
    try {
      if (maxValue < 0) return [];
      if (maxValue === 0) return [0];
      
      const sequence = [0, 1];
      
      while (true) {
        const next = sequence[sequence.length - 1] + sequence[sequence.length - 2];
        if (next > maxValue) break;
        sequence.push(next);
      }
      
      return sequence;
    } catch (error) {
      console.error('Fibonacci calculation error:', error);
      return [];
    }
  },
  
  /**
   * Identify prime numbers from given array
   */
  async getPrimeNumbers(numbers) {
    try {
      const primes = [];
      
      for (const num of numbers) {
        if (this.isPrime(num)) {
          primes.push(num);
        }
      }
      
      return primes.sort((a, b) => a - b);
    } catch (error) {
      console.error('Prime number calculation error:', error);
      return [];
    }
  },
  
  /**
   * Check if a number is prime
   */
  isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    const sqrt = Math.sqrt(n);
    for (let i = 3; i <= sqrt; i += 2) {
      if (n % i === 0) return false;
    }
    
    return true;
  },
  
  /**
   * Calculate LCM (Least Common Multiple) of array of numbers
   */
  async calculateLCM(numbers) {
    try {
      if (numbers.length === 0) return null;
      if (numbers.length === 1) return Math.abs(numbers[0]);
      
      // Filter out zeros and get absolute values
      const filteredNumbers = numbers
        .filter(num => num !== 0)
        .map(num => Math.abs(Math.floor(num)));
      
      if (filteredNumbers.length === 0) return 0;
      if (filteredNumbers.length === 1) return filteredNumbers[0];
      
      return filteredNumbers.reduce((lcm, num) => this.lcmTwoNumbers(lcm, num));
    } catch (error) {
      console.error('LCM calculation error:', error);
      return null;
    }
  },
  
  /**
   * Calculate HCF/GCD (Highest Common Factor/Greatest Common Divisor) of array of numbers
   */
  async calculateHCF(numbers) {
    try {
      if (numbers.length === 0) return null;
      if (numbers.length === 1) return Math.abs(numbers[0]);
      
      // Filter out zeros and get absolute values
      const filteredNumbers = numbers
        .filter(num => num !== 0)
        .map(num => Math.abs(Math.floor(num)));
      
      if (filteredNumbers.length === 0) return null;
      if (filteredNumbers.length === 1) return filteredNumbers[0];
      
      return filteredNumbers.reduce((hcf, num) => this.gcdTwoNumbers(hcf, num));
    } catch (error) {
      console.error('HCF calculation error:', error);
      return null;
    }
  },
  
  /**
   * Calculate LCM of two numbers
   */
  lcmTwoNumbers(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / this.gcdTwoNumbers(a, b);
  },
  
  /**
   * Calculate GCD of two numbers using Euclidean algorithm
   */
  gcdTwoNumbers(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    
    return a;
  },
  
  /**
   * Generate mathematical insights for given numbers
   */
  async getMathematicalInsights(numbers) {
    try {
      if (numbers.length === 0) {
        return { message: 'No numbers provided for analysis' };
      }
      
      const [fibonacci, primes, lcm, hcf] = await Promise.all([
        this.getFibonacciSequence(Math.max(...numbers)),
        this.getPrimeNumbers(numbers),
        this.calculateLCM(numbers),
        this.calculateHCF(numbers)
      ]);
      
      // Additional insights
      const insights = {
        total_numbers: numbers.length,
        unique_numbers: [...new Set(numbers)].length,
        even_numbers: numbers.filter(n => n % 2 === 0).length,
        odd_numbers: numbers.filter(n => n % 2 !== 0).length,
        positive_numbers: numbers.filter(n => n > 0).length,
        negative_numbers: numbers.filter(n => n < 0).length,
        zero_count: numbers.filter(n => n === 0).length,
        perfect_squares: numbers.filter(n => this.isPerfectSquare(n)).length,
        fibonacci_numbers: numbers.filter(n => this.isFibonacci(n)).length,
        prime_numbers: primes.length,
        composite_numbers: numbers.filter(n => n > 1 && !this.isPrime(n)).length
      };
      
      return {
        fibonacci_sequence: fibonacci,
        prime_numbers: primes,
        lcm: lcm,
        hcf: hcf,
        insights: insights,
        statistical_summary: {
          mean: numbers.reduce((a, b) => a + b, 0) / numbers.length,
          median: this.calculateMedian(numbers),
          mode: this.calculateMode(numbers),
          range: Math.max(...numbers) - Math.min(...numbers),
          standard_deviation: this.calculateStandardDeviation(numbers)
        }
      };
    } catch (error) {
      console.error('Mathematical insights error:', error);
      return { error: 'Failed to generate mathematical insights' };
    }
  },
  
  /**
   * Check if number is perfect square
   */
  isPerfectSquare(n) {
    if (n < 0) return false;
    const sqrt = Math.sqrt(n);
    return sqrt === Math.floor(sqrt);
  },
  
  /**
   * Check if number is in Fibonacci sequence
   */
  isFibonacci(n) {
    if (n < 0) return false;
    return this.isPerfectSquare(5 * n * n + 4) || this.isPerfectSquare(5 * n * n - 4);
  },
  
  /**
   * Calculate median of array
   */
  calculateMedian(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  },
  
  /**
   * Calculate mode of array
   */
  calculateMode(numbers) {
    const frequency = {};
    let maxFreq = 0;
    let modes = [];
    
    for (const num of numbers) {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        modes = [num];
      } else if (frequency[num] === maxFreq && !modes.includes(num)) {
        modes.push(num);
      }
    }
    
    return modes.length === numbers.length ? null : modes;
  },
  
  /**
   * Calculate standard deviation
   */
  calculateStandardDeviation(numbers) {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / numbers.length;
    return Math.sqrt(variance);
  }
};

module.exports = mathService;
