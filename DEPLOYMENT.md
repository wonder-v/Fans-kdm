# Deployment Guide - Fans-Kdm

## Prerequisites
- Cloudflare Account
- YouTube API Key
- Midtrans Account
- Node.js & npm
- Wrangler CLI

## Backend Deployment

### 1. Setup Cloudflare
```bash
npm install -g wrangler
wrangler login
```

### 2. Create Resources
```bash
cd backend

# Create D1 Database
wrangler d1 create fans-kdm-db

# Create KV Namespace
wrangler kv:namespace create CACHE

# Create R2 Bucket
wrangler r2 bucket create fans-kdm-storage
```

### 3. Configure Environment
Edit `backend/wrangler.toml` dengan IDs yang didapat.

### 4. Deploy
```bash
npm install
npm run deploy
```

## Frontend Deployment

### 1. Setup React Native
```bash
cd frontend
npm install
```

### 2. Configure API URL
Edit API base URL di `src/services/api.js`

### 3. Build
```bash
# Android
npm run android

# iOS
npm run ios
```

## Environment Variables
```env
JWT_SECRET=your-jwt-secret
YOUTUBE_API_KEY=your-youtube-api-key
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
TRAKTEER_URL=https://trakteer.id/anichinapk
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Trakteer Integration
- URL: https://trakteer.id/anichinapk
- Component: TrakteerButton.js
- API: GET /api/donations/trakteer