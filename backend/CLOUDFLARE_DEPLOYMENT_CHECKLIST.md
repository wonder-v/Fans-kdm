# Cloudflare Workers Deployment Checklist

## ✅ Perbaikan yang Sudah Dilakukan

### 1. Dependencies
- ✅ Tambah dependency `hono` untuk JWT authentication
- ✅ Update `itty-router` untuk routing yang lebih baik

### 2. CORS Configuration
- ✅ Fix CORS middleware untuk return proper response
- ✅ Tambah `addCORSHeaders` function untuk semua responses
- ✅ Update CORS untuk handle OPTIONS preflight requests dengan status 204

### 3. Main Worker (index.js)
- ✅ Fix export default dengan proper fetch handler
- ✅ Pass `env` dan `ctx` parameters ke semua route handlers
- ✅ Tambah error handling yang comprehensive
- ✅ Integrate CORS headers ke semua responses

### 4. Route Handlers
- ✅ Tambah `base` path ke semua routers
- ✅ Fix auth router dengan proper JWT imports
- ✅ Fix videos router dengan proper env parameter
- ✅ Fix forum router dengan proper env parameter
- ✅ Fix events router dengan proper env parameter
- ✅ Fix donations router dengan proper env parameter
- ✅ Fix gallery router dengan proper env parameter

### 5. Middleware
- ✅ Buat auth middleware untuk JWT verification
- ✅ Fix CORS middleware untuk kompatibilitas dengan Cloudflare Workers

### 6. Configuration
- ✅ Tambah `node_compat = true` di wrangler.toml
- ✅ Buat file `.dev.vars.example` untuk environment variables
- ✅ Update wrangler.toml dengan proper structure

## 🚀 Langkah Deployment

### Persiapan (Hanya sekali)

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Login ke Cloudflare**
   ```bash
   wrangler login
   ```

3. **Buat D1 Database**
   ```bash
   cd backend
   wrangler d1 create fans-kdm-db
   ```
   Salin `database_id` yang diberikan dan update di `wrangler.toml`

4. **Buat KV Namespace**
   ```bash
   wrangler kv:namespace create CACHE
   wrangler kv:namespace create CACHE --preview
   ```
   Salin `id` dan `preview_id` yang diberikan dan update di `wrangler.toml`

5. **Buat R2 Bucket**
   ```bash
   wrangler r2 bucket create fans-kdm-storage
   ```

6. **Migrate Database**
   ```bash
   wrangler d1 execute fans-kdm-db --file=../database/schema/schema.sql
   ```

7. **Set Environment Variables**
   ```bash
   # Untuk production, gunakan secrets
   wrangler secret put JWT_SECRET
   wrangler secret put YOUTUBE_API_KEY
   wrangler secret put MIDTRANS_SERVER_KEY
   wrangler secret put MIDTRANS_CLIENT_KEY
   ```

### Deployment

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Test Locally (Opsional)**
   ```bash
   # Buat file .dev.vars dari .dev.vars.example
   cp .dev.vars.example .dev.vars
   # Edit .dev.vars dengan values yang sesuai
   
   # Run development server
   npm run dev
   ```

3. **Deploy ke Cloudflare**
   ```bash
   npm run deploy
   ```

4. **Verify Deployment**
   ```bash
   curl https://fans-kdm-api.your-subdomain.workers.dev/health
   ```

## 🔍 Verifikasi Post-Deployment

### Test Endpoints

1. **Health Check**
   ```bash
   curl https://your-worker-url.workers.dev/health
   ```
   Expected: `{"status":"OK","timestamp":"..."}`

2. **CORS Test**
   ```bash
   curl -X OPTIONS https://your-worker-url.workers.dev/api/videos/ \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET"
   ```
   Expected: Status 204 dengan CORS headers

3. **Videos Endpoint** (Requires YouTube API Key)
   ```bash
   curl https://your-worker-url.workers.dev/api/videos/
   ```

4. **Trakteer Endpoint**
   ```bash
   curl https://your-worker-url.workers.dev/api/donations/trakteer
   ```

## ⚠️ Common Issues & Solutions

### Issue 1: "Module not found: itty-router"
**Solution:** 
```bash
cd backend && npm install
```

### Issue 2: "Database not found"
**Solution:**
```bash
wrangler d1 create fans-kdm-db
# Update database_id di wrangler.toml
wrangler d1 execute fans-kdm-db --file=../database/schema/schema.sql
```

### Issue 3: "KV namespace not found"
**Solution:**
```bash
wrangler kv:namespace create CACHE
wrangler kv:namespace create CACHE --preview
# Update id dan preview_id di wrangler.toml
```

### Issue 4: "R2 bucket not found"
**Solution:**
```bash
wrangler r2 bucket create fans-kdm-storage
```

### Issue 5: "Environment variable undefined"
**Solution:**
```bash
# Untuk development
# Edit .dev.vars dengan values yang sesuai

# Untuk production
wrangler secret put VARIABLE_NAME
```

### Issue 6: "CORS error in browser"
**Solution:** Tambah origin di `src/middleware/cors.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8081',
  'https://fans-kdm.vercel.app',
  'https://fans-kdm.netlify.app',
  'https://your-domain.com' // Tambah domain baru
];
```

## 📝 File Structure

```
backend/
├── src/
│   ├── index.js                 # Main worker entry point
│   ├── middleware/
│   │   ├── cors.js             # CORS handling
│   │   └── auth.js             # JWT authentication
│   └── routes/
│       ├── auth.js             # Authentication routes
│       ├── videos.js           # YouTube videos
│       ├── forum.js            # Forum posts
│       ├── events.js           # Events
│       ├── donations.js        # Donations/Trakteer
│       └── gallery.js          # Gallery/R2 uploads
├── wrangler.toml               # Cloudflare configuration
├── package.json                # Dependencies
├── .dev.vars.example           # Example env vars
└── README.md                   # Documentation
```

## ✨ Key Features

- ✅ **ESM Modules**: Menggunakan ES Modules (import/export)
- ✅ **CORS**: Properly configured untuk cross-origin requests
- ✅ **JWT Auth**: Using Hono JWT library
- ✅ **D1 Database**: SQLite-based database
- ✅ **KV Cache**: Key-value caching for YouTube data
- ✅ **R2 Storage**: Object storage untuk files
- ✅ **Error Handling**: Comprehensive error handling
- ✅ **TypeScript Compatible**: Can be migrated to TypeScript

## 🎯 Next Steps

1. Test semua endpoints setelah deployment
2. Setup monitoring di Cloudflare Dashboard
3. Configure rate limiting jika diperlukan
4. Setup custom domain jika ada
5. Configure caching strategies
6. Setup CI/CD untuk automatic deployment

## 📚 Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [KV Storage Docs](https://developers.cloudflare.com/kv/)
- [R2 Storage Docs](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
