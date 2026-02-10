# BAJAJ BFHL API - Vercel Deployment Guide

## Fixed Issues for Vercel Deployment

The server has been restructured for Vercel serverless deployment:

### Changes Made:
1. Created `api/index.js` - Serverless function entry point  
2. Updated `vercel.json` - Proper routing configuration
3. Fixed environment variable parsing issues
4. Added serverless-optimized rate limiting
5. Updated package.json main entry point

## Deployment Steps

### 1. Set Environment Variables in Vercel Dashboard
```
GEMINI_API_KEY=your_actual_gemini_api_key
NODE_ENV=production
USER_EMAIL=your_email@domain.com
ROLL_NUMBER=your_roll_number
ALLOWED_ORIGINS=https://your-frontend-domain.com
RATE_LIMIT=100
REQUEST_TIMEOUT=30000
JSON_LIMIT=10mb
URL_ENCODED_LIMIT=10mb
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### 3. Alternative: GitHub Integration
1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Set environment variables
4. Deploy

## API Endpoints (Production)
- Main API: `https://your-vercel-app.vercel.app/`
- Health Check: `https://your-vercel-app.vercel.app/api/health`
- BFHL Endpoint: `https://your-vercel-app.vercel.app/bfhl`

## Local Development
```bash
# Run locally (traditional server)
npm run dev

# Test serverless function locally
vercel dev
```

## Important Notes
- Environment variables must be set in Vercel Dashboard
- API rate limiting is optimized for serverless
- Health check endpoint skips rate limiting in production
- All routes work through the single serverless function

## Troubleshooting
- Ensure all environment variables are set in Vercel
- Check function logs in Vercel Dashboard
- Verify API key is valid and properly formatted
- Test endpoints individually after deployment