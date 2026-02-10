# Testing Your Gemini API Key

This document explains how to verify if your Google Gemini API key is working correctly.

## Quick Check

### Option 1: Using the CLI Test Script

Run the test script to check your Gemini API key:

```bash
node src/utils/testGeminiKey.js
```

This will:
1. ✅ Check if GEMINI_API_KEY is configured
2. ✅ Validate the API key format
3. ✅ Test API connection with a simple request
4. ✅ Test analysis functionality with sample data

**Expected Output (Success):**
```
============================================================
GEMINI API KEY TEST
============================================================

Step 1: Checking API Key Configuration
------------------------------------------------------------
✓ GEMINI_API_KEY is configured
  Length: 39 characters
  Starts with: AIzaSy...

Step 2: Validating API Key Format
------------------------------------------------------------
✓ API key format looks valid (starts with "AIza")
✓ API key length looks reasonable

Step 3: Testing API Connection
------------------------------------------------------------
Sending test request to Gemini API...
✓ Successfully received response from Gemini API
  Response: "Hello"
  Response time: 1234ms

Step 4: Testing Analysis Functionality
------------------------------------------------------------
Sending analysis request...
✓ Successfully received analysis from Gemini API
  Analysis result: "sequential"
  Response time: 987ms

============================================================
✓ GEMINI API KEY IS WORKING CORRECTLY
============================================================

Your Gemini API key is properly configured and functional.
The AI service in your application should work as expected.
```

**Expected Output (Not Configured):**
```
❌ GEMINI_API_KEY is NOT configured in environment variables

To fix this:
1. Create a .env file in the project root
2. Add: GEMINI_API_KEY=your_api_key_here
3. Get your API key from: https://aistudio.google.com/app/apikey
```

### Option 2: Using the API Endpoint

If your server is running, you can check the Gemini status via the API:

```bash
# Start the server
npm start

# In another terminal, check the status
curl http://localhost:3000/bfhl/gemini-status
```

**Example Response (Working):**
```json
{
  "is_success": true,
  "gemini_configured": true,
  "gemini_enabled": true,
  "format_valid": true,
  "connection_test": "success",
  "test_response": "sequential",
  "message": "Gemini API key is working correctly",
  "key_length": 39,
  "key_prefix": "AIzaSy"
}
```

**Example Response (Not Configured):**
```json
{
  "is_success": true,
  "gemini_configured": false,
  "gemini_enabled": false,
  "message": "GEMINI_API_KEY is not configured in environment variables",
  "instructions": "Add GEMINI_API_KEY to your .env file to enable AI features",
  "api_key_url": "https://aistudio.google.com/app/apikey"
}
```

## Setting Up Your Gemini API Key

If you don't have a Gemini API key yet:

1. **Get an API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key (it will start with `AIza`)

2. **Configure the API Key:**
   - Create a `.env` file in the project root:
     ```bash
     touch .env
     ```
   - Add your API key:
     ```
     GEMINI_API_KEY=AIzaSy...your_actual_key_here
     ```
   - Optionally add other environment variables:
     ```
     USER_EMAIL=your_email@gmail.com
     ROLL_NUMBER=YOUR123
     PORT=3000
     NODE_ENV=development
     ```

3. **Test the Configuration:**
   ```bash
   node src/utils/testGeminiKey.js
   ```

## Troubleshooting

### Error: API_KEY_INVALID
- **Problem:** Your API key is invalid or expired
- **Solution:** 
  - Verify your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
  - Generate a new API key if needed
  - Make sure you copied the entire key

### Error: Quota Exceeded
- **Problem:** You've exceeded your API quota or rate limit
- **Solution:**
  - Check your usage at [Google AI Studio](https://aistudio.google.com/)
  - Wait for your quota to reset
  - Consider upgrading your plan if needed

### Error: Network Issue
- **Problem:** Cannot connect to the Gemini API
- **Solution:**
  - Check your internet connection
  - Verify you're not behind a firewall blocking the API
  - Try again in a few moments

### Key Format Warning
- **Problem:** API key doesn't start with "AIza"
- **Solution:**
  - Verify you copied the correct key
  - Make sure you're using a Gemini API key (not a different Google API key)

## Integration in Your Application

The Gemini API is automatically used in the main `/bfhl` POST endpoint for:

- **Single-word analysis:** Describes data patterns (e.g., "sequential", "random")
- **Data sentiment:** Overall sentiment of the data (e.g., "positive", "neutral")
- **AI recommendations:** Suggestions for data processing
- **Quality assessment:** Data quality evaluation
- **Pattern detection:** Identifies patterns in the data

When the API key is not configured or fails, the application will:
- Still process all mathematical operations normally
- Return `"unavailable"` or `"error"` for AI-powered fields
- Log warnings to help you debug

## API Key Security

⚠️ **Important Security Notes:**

1. **Never commit your .env file:** It's already in `.gitignore`
2. **Don't share your API key:** Keep it confidential
3. **Rotate keys regularly:** Generate new keys periodically
4. **Use environment variables:** Never hardcode API keys in your code
5. **Monitor usage:** Check [Google AI Studio](https://aistudio.google.com/) regularly

## Further Help

- **Gemini API Documentation:** https://ai.google.dev/docs
- **Get API Key:** https://aistudio.google.com/app/apikey
- **Check Usage:** https://aistudio.google.com/
- **Report Issues:** Create an issue in this repository
