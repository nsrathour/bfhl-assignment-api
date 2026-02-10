# BFHL Assignment API

A RESTful API built with Express.js that processes data with integrated Google Gemini AI capabilities. This API performs mathematical operations, text analysis, file processing, and AI-powered insights.

## Features

- 🔢 **Mathematical Operations**: Sum, product, primes, Fibonacci, LCM, HCF
- 🤖 **AI-Powered Insights**: Single-word analysis, sentiment analysis, recommendations using Google Gemini
- 📁 **File Processing**: MIME type detection, file validation
- 🔍 **Pattern Detection**: Anomaly detection, sequence analysis
- 📊 **Data Quality Assessment**: Completeness, consistency, validity scoring
- 🛡️ **Security**: Rate limiting, CORS, helmet middleware

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Google Gemini API Key (optional, but required for AI features)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd bfhl-assignment-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

## Configuration

Create a `.env` file in the project root with the following variables:

```env
# Required for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# User Information
USER_EMAIL=your_email@gmail.com
ROLL_NUMBER=YOUR123

# Server Configuration (optional)
PORT=3000
NODE_ENV=development
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (starts with `AIza`)
5. Add it to your `.env` file

## Usage

### Start the Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The server will start on `http://localhost:3000` (or the PORT specified in .env)

### Test Your Gemini API Key

Before using the AI features, verify your Gemini API key is working:

```bash
# Run the test script
npm run test:gemini

# Or directly
node src/utils/testGeminiKey.js
```

See [GEMINI_TESTING.md](./GEMINI_TESTING.md) for detailed testing instructions.

### Check Gemini Status via API

You can also check the Gemini API status through the endpoint:

```bash
curl http://localhost:3000/bfhl/gemini-status
```

## API Endpoints

### GET /bfhl

Returns operation code information.

**Response:**
```json
{
  "is_success": true,
  "official_email": "your_email@gmail.com"
}
```

### POST /bfhl

Processes data with mathematical and AI operations.

**Request:**
```json
{
  "data": ["1", "2", "a", "b", "3"],
  "file_b64": "optional_base64_encoded_file"
}
```

**Response:**
```json
{
  "is_success": true,
  "user_id": "unique_user_id",
  "email": "your_email@gmail.com",
  "roll_number": "YOUR123",
  "numbers": ["1", "2", "3"],
  "alphabets": ["a", "b"],
  "highest_lowercase_alphabet": ["b"],
  "file_valid": true,
  "file_mime_type": "image/png",
  "file_size_kb": 45.2,
  "gemini_ai_insights": {
    "gemini_analysis": "sequential",
    "data_sentiment": "neutral",
    "ai_recommendation": "optimize",
    "ai_confidence": 0.9
  },
  "analytics": {
    "processing_time_ms": 123.45,
    "mathematical_operations": { ... },
    "ai_insights": { ... }
  }
}
```

### GET /bfhl/gemini-status

Checks if the Gemini API key is configured and working.

**Response:**
```json
{
  "is_success": true,
  "gemini_configured": true,
  "gemini_enabled": true,
  "format_valid": true,
  "connection_test": "success",
  "message": "Gemini API key is working correctly"
}
```

## How It Works

### Without Gemini API Key

The API will still function normally:
- All mathematical operations work
- All file processing works
- AI-powered fields will show `"unavailable"` or fallback values
- Processing continues without errors

### With Gemini API Key

When properly configured, the API provides:
- Intelligent single-word analysis of data patterns
- Sentiment analysis
- AI-powered recommendations
- Enhanced insights and suggestions

## Development

### Project Structure

```
bfhl-assignment-api/
├── src/
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Server entry point
│   ├── controllers/
│   │   └── bfhl.controller.js  # Request handlers
│   ├── routes/
│   │   └── bfhl.routes.js      # API routes
│   ├── services/
│   │   ├── ai.service.js       # Gemini AI integration
│   │   └── math.service.js     # Mathematical operations
│   └── utils/
│       └── testGeminiKey.js    # Gemini API key tester
├── api/
│   └── index.js                # Vercel serverless entry
├── .env.example                # Environment variables template
├── package.json
└── vercel.json                 # Vercel configuration
```

### Adding Features

1. Follow the existing code structure
2. Add new services in `src/services/`
3. Add new routes in `src/routes/`
4. Add new controllers in `src/controllers/`
5. Test thoroughly before committing

## Testing

```bash
# Test Gemini API key
npm run test:gemini

# Manual API testing
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["1", "2", "a", "b"]}'
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `USER_EMAIL`
   - `ROLL_NUMBER`

### Other Platforms

The application can be deployed to any Node.js hosting platform:
- Heroku
- Railway
- Render
- AWS/GCP/Azure

Remember to set environment variables in your hosting platform.

## Security

- API keys are never committed to version control (`.env` in `.gitignore`)
- Rate limiting enabled (10 requests/minute for POST)
- CORS configured for security
- Helmet middleware for HTTP security headers
- Request size limits enforced

## Troubleshooting

### Gemini API Issues

See [GEMINI_TESTING.md](./GEMINI_TESTING.md) for detailed troubleshooting.

Common issues:
- **"GEMINI_API_KEY not configured"**: Add the key to your `.env` file
- **"API_KEY_INVALID"**: Verify your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
- **"Quota exceeded"**: Check your usage limits in Google AI Studio

### Server Issues

```bash
# Check if port is already in use
lsof -i :3000

# Use a different port
PORT=3001 npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

## Support

For issues or questions:
1. Check [GEMINI_TESTING.md](./GEMINI_TESTING.md) for API key issues
2. Review existing issues on GitHub
3. Create a new issue with detailed information

## Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Get Gemini API Key](https://aistudio.google.com/app/apikey)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/)
