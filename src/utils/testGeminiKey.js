require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Test Gemini API Key Functionality
 * This script verifies if the GEMINI_API_KEY is properly configured and working
 */

async function testGeminiKey() {
  console.log('='.repeat(60));
  console.log('GEMINI API KEY TEST');
  console.log('='.repeat(60));
  console.log();

  // Step 1: Check if API key is configured
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('Step 1: Checking API Key Configuration');
  console.log('-'.repeat(60));
  
  if (!apiKey) {
    console.log('❌ GEMINI_API_KEY is NOT configured in environment variables');
    console.log();
    console.log('To fix this:');
    console.log('1. Create a .env file in the project root');
    console.log('2. Add: GEMINI_API_KEY=your_api_key_here');
    console.log('3. Get your API key from: https://aistudio.google.com/app/apikey');
    console.log();
    return false;
  }
  
  console.log('✓ GEMINI_API_KEY is configured');
  console.log(`  Length: ${apiKey.length} characters`);
  console.log(`  Starts with: ${apiKey.substring(0, 6)}...`);
  console.log();

  // Step 2: Validate API key format
  console.log('Step 2: Validating API Key Format');
  console.log('-'.repeat(60));
  
  if (!apiKey.startsWith('AIza')) {
    console.log('⚠ WARNING: API key does not start with "AIza"');
    console.log('  This may not be a valid Google Gemini API key');
  } else {
    console.log('✓ API key format looks valid (starts with "AIza")');
  }
  
  if (apiKey.length < 20) {
    console.log('⚠ WARNING: API key seems too short');
    console.log('  Valid keys are typically 39 characters long');
  } else {
    console.log('✓ API key length looks reasonable');
  }
  console.log();

  // Step 3: Test API connection
  console.log('Step 3: Testing API Connection');
  console.log('-'.repeat(60));
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('Sending test request to Gemini API...');
    const startTime = Date.now();
    
    const result = await model.generateContent('Say "Hello" in one word only.');
    const response = await result.response;
    const text = response.text();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('✓ Successfully received response from Gemini API');
    console.log(`  Response: "${text}"`);
    console.log(`  Response time: ${duration}ms`);
    console.log();
    
    // Step 4: Test with actual analysis task
    console.log('Step 4: Testing Analysis Functionality');
    console.log('-'.repeat(60));
    
    const testData = { numbers: [1, 2, 3, 4, 5], alphabets: ['a', 'b', 'c'] };
    const prompt = `Analyze this data and provide ONLY ONE WORD that best describes the overall pattern: ${JSON.stringify(testData)}`;
    
    console.log('Sending analysis request...');
    const analysisStart = Date.now();
    
    const analysisResult = await model.generateContent(prompt);
    const analysisResponse = await analysisResult.response;
    const analysisText = analysisResponse.text().trim().toLowerCase();
    
    const analysisEnd = Date.now();
    const analysisDuration = analysisEnd - analysisStart;
    
    const singleWord = analysisText.split(/\s+/)[0].replace(/[^a-z]/g, '');
    
    if (!singleWord || singleWord.length === 0) {
      console.log('⚠ WARNING: Gemini API returned empty or invalid response');
      console.log(`  Raw response: "${analysisText}"`);
      console.log(`  Response time: ${analysisDuration}ms`);
      console.log();
      console.log('The API is responding, but may not be functioning optimally.');
    } else {
      console.log('✓ Successfully received analysis from Gemini API');
      console.log(`  Analysis result: "${singleWord}"`);
      console.log(`  Response time: ${analysisDuration}ms`);
    }
    console.log();
    
    // Final summary
    console.log('='.repeat(60));
    console.log('✓ GEMINI API KEY IS WORKING CORRECTLY');
    console.log('='.repeat(60));
    console.log();
    console.log('Your Gemini API key is properly configured and functional.');
    console.log('The AI service in your application should work as expected.');
    console.log();
    
    return true;
    
  } catch (error) {
    console.log('❌ Failed to connect to Gemini API');
    console.log();
    console.log('Error details:');
    console.log(`  Type: ${error.name}`);
    console.log(`  Message: ${error.message}`);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key')) {
      console.log();
      console.log('This error suggests your API key is invalid or expired.');
      console.log('Please verify your API key at: https://aistudio.google.com/app/apikey');
    } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
      console.log();
      console.log('This error suggests you have exceeded your API quota or rate limit.');
      console.log('Please check your usage at: https://aistudio.google.com/');
    } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
      console.log();
      console.log('This error suggests a network connectivity issue.');
      console.log('Please check your internet connection.');
    }
    
    console.log();
    console.log('='.repeat(60));
    console.log('❌ GEMINI API KEY TEST FAILED');
    console.log('='.repeat(60));
    console.log();
    
    return false;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testGeminiKey()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = testGeminiKey;
