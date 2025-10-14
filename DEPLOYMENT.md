# Deployment Guide - Fans-Kdm

## Prerequisites
- Cloudflare Account
- YouTube API Key
- Midtrans Account (optional)
- Node.js v18+ & npm
- Wrangler CLI

## Backend Deployment (Cloudflare Workers)

### 1. Setup Cloudflare
```bash
npm install -g wrangler
wrangler login
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Create Resources
```bash
# Create D1 Database
wrangler d1 create fans-kdm-db
# Copy the database_id from output

# Create KV Namespace
wrangler kv:namespace create CACHE
# Copy the id from output

# Create KV Namespace for Preview
wrangler kv:namespace create CACHE --preview
# Copy the preview_id from output

# Create R2 Bucket
wrangler r2 bucket create fans-kdm-storage
```

### 4. Configure Environment
Edit `backend/wrangler.toml` dan update dengan IDs dari step 3:

```toml
[[d1_databases]]
binding = "DB"
database_name = "fans-kdm-db"
database_id = "paste-your-database-id-here"

[[kv_namespaces]]
binding = "CACHE"
id = "paste-your-kv-id-here"
preview_id = "paste-your-preview-kv-id-here"
```

### 5. Migrate Database
```bash
wrangler d1 execute fans-kdm-db --file=../database/schema/schema.sql
```

### 6. Set Environment Variables (Secrets)
```bash
wrangler secret put JWT_SECRET
# Enter your secret when prompted

wrangler secret put YOUTUBE_API_KEY
# Enter your YouTube API key

wrangler secret put MIDTRANS_SERVER_KEY
# Enter your Midtrans server key (optional)

wrangler secret put MIDTRANS_CLIENT_KEY
# Enter your Midtrans client key (optional)
```

### 7. Deploy to Cloudflare
```bash
npm run deploy
```

### 8. Verify Deployment
```bash
curl https://fans-kdm-api.your-subdomain.workers.dev/health
```

Expected response: `{"status":"OK","timestamp":"..."}`

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