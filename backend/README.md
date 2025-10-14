# Fans-KDM Backend API

Backend API untuk aplikasi Fans-KDM menggunakan Cloudflare Workers, D1, KV, dan R2.

## Prerequisites

- Node.js v18+
- npm atau yarn
- Akun Cloudflare
- Wrangler CLI (`npm install -g wrangler`)

## Setup Lokal

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Login ke Cloudflare

```bash
wrangler login
```

### 3. Buat Resources Cloudflare

```bash
# Buat D1 Database
wrangler d1 create fans-kdm-db

# Buat KV Namespace untuk Cache
wrangler kv:namespace create CACHE

# Buat KV Namespace untuk Preview (development)
wrangler kv:namespace create CACHE --preview

# Buat R2 Bucket untuk Storage
wrangler r2 bucket create fans-kdm-storage
```

### 4. Update wrangler.toml

Setelah membuat resources, salin ID yang diberikan dan update file `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "fans-kdm-db"
database_id = "your-database-id-here"  # Ganti dengan ID dari step 3

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id-here"  # Ganti dengan ID dari step 3
preview_id = "your-preview-kv-namespace-id-here"  # Ganti dengan preview ID dari step 3
```

### 5. Migrate Database

```bash
wrangler d1 execute fans-kdm-db --file=../database/schema/schema.sql
```

### 6. Setup Environment Variables

Untuk development lokal, buat file `.dev.vars`:

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` dan isi dengan nilai yang sesuai:

```env
JWT_SECRET=your-strong-secret-key
YOUTUBE_API_KEY=your-youtube-api-key
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
TRAKTEER_URL=https://trakteer.id/anichinapk
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Untuk production, set environment variables di Cloudflare Dashboard atau via wrangler:

```bash
wrangler secret put JWT_SECRET
wrangler secret put YOUTUBE_API_KEY
wrangler secret put MIDTRANS_SERVER_KEY
wrangler secret put MIDTRANS_CLIENT_KEY
```

### 7. Run Development Server

```bash
npm run dev
```

API akan tersedia di `http://localhost:8787`

## Deployment

### Deploy ke Production

```bash
npm run deploy
```

atau dengan environment tertentu:

```bash
# Deploy ke staging
wrangler deploy --env staging

# Deploy ke production
wrangler deploy --env production
```

## API Endpoints

### Health Check
```
GET /health
```

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Videos
```
GET /api/videos/
```

### Forum
```
GET /api/forum/posts
POST /api/forum/posts
GET /api/forum/posts/:id
```

### Events
```
GET /api/events/
POST /api/events/
```

### Donations
```
GET /api/donations/trakteer
POST /api/donations/
GET /api/donations/status/:id
```

### Gallery
```
GET /api/gallery/
POST /api/gallery/upload
```

## Troubleshooting

### Error: "Module not found"

Pastikan semua dependencies sudah terinstall:
```bash
npm install
```

### Error: "Database not found"

Pastikan sudah membuat dan migrate database:
```bash
wrangler d1 create fans-kdm-db
wrangler d1 execute fans-kdm-db --file=../database/schema/schema.sql
```

### Error: "CORS issues"

CORS sudah dikonfigurasi untuk:
- `http://localhost:3000`
- `http://localhost:8081`
- `https://fans-kdm.vercel.app`
- `https://fans-kdm.netlify.app`

Tambahkan origin lain di `src/middleware/cors.js` jika diperlukan.

## Development Notes

- API menggunakan itty-router untuk routing
- JWT authentication menggunakan Hono JWT
- Database menggunakan Cloudflare D1 (SQLite)
- Cache menggunakan Cloudflare KV
- File storage menggunakan Cloudflare R2

## License

MIT
