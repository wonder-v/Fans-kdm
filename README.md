# Fans-Kdm - Aplikasi Fans Kang Dedi Mulyadi

Aplikasi mobile untuk fans Kang Dedi Mulyadi dengan fitur feed video, forum diskusi, kalender event, galeri, dan donasi.

## 🚀 Fitur Utama

- 📺 **Feed Video**: Video terbaru dari YouTube @KangDediMulyadiChannel
- 💬 **Forum Diskusi**: Forum fans dengan login/register, posting, komentar
- 📅 **Kalender Event**: CRUD event Kang Dedi
- 🖼️ **Galeri**: Foto & dokumen dengan storage R2
- 💝 **Donasi**: Sistem donasi dengan Midtrans + Trakteer
- 🔐 **Authentication**: JWT-based user management

## 🏗️ Arsitektur

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌─────────────┐
│   Frontend  │───▶│ Cloudflare   │───▶│   Database      │    │   External  │
│  (Mobile)   │    │   Workers    │    │   Services      │    │   External  │
└─────────────┘    └──────────────┘    └─────────────────┘    └─────────────┘
                          │                       │                    │
                          │                       │                    │
                    ┌─────▼─────┐         ┌───────▼──────┐    ┌────────▼────────┐
                    │   KV      │         │     D1       │    │   YouTube API   │
                    │  Cache    │         │   Database   │    │   Midtrans      │
                    └───────────┘         └──────────────┘    │   Trakteer      │
                                                              └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Cloudflare Workers** - Serverless API
- **Cloudflare D1** - SQL Database
- **Cloudflare KV** - Cache storage
- **Cloudflare R2** - File storage

### Frontend
- **React Native** - Mobile app
- **Redux Toolkit** - State management
- **React Navigation** - Navigation

### External Services
- **YouTube Data API** - Video feed
- **Midtrans** - Payment gateway
- **Trakteer** - Donasi pengembang

## 📁 Struktur Proyek

```
fans-kdm/
├── backend/                 # Cloudflare Workers
│   ├── src/
│   │   ├── index.js        # Main entry point
│   │   ├── middleware/     # CORS, Auth middleware
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── wrangler.toml       # Workers configuration
│   └── package.json        # Backend dependencies
├── frontend/               # React Native app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── screens/        # App screens
│   │   ├── services/       # API services
│   │   └── store/          # Redux store
│   └── package.json        # Frontend dependencies
├── database/               # Database schema
│   └── schema/
│       └── schema.sql      # D1 database schema
└── docs/                   # Documentation
```

## 🗄️ Database Schema

### Tables
- **users** - User accounts
- **posts** - Forum posts
- **comments** - Post comments
- **events** - Event calendar
- **donations** - Donation records
- **gallery** - File storage
- **video_cache** - YouTube video cache

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Videos
- `GET /api/videos` - Get latest videos (with KV cache)

### Forum
- `GET /api/forum/posts` - Get all posts
- `POST /api/forum/posts` - Create new post
- `GET /api/forum/posts/:id` - Get post with comments
- `POST /api/forum/posts/:id/comments` - Add comment

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event

### Donations
- `POST /api/donations` - Create donation (Midtrans)
- `GET /api/donations/trakteer` - Get Trakteer info

### Gallery
- `GET /api/gallery` - Get gallery items
- `POST /api/gallery/upload` - Upload file to R2

## 🚀 Quick Start

### Backend Setup

1. **Install Wrangler CLI**
```bash
npm install -g wrangler
```

2. **Login to Cloudflare**
```bash
wrangler login
```

3. **Setup Database**
```bash
cd backend
wrangler d1 create fans-kdm-db
wrangler d1 execute fans-kdm-db --file=../database/schema/schema.sql
```

4. **Setup KV Namespace**
```bash
wrangler kv:namespace create CACHE
```

5. **Setup R2 Bucket**
```bash
wrangler r2 bucket create fans-kdm-storage
```

6. **Configure Environment**
Edit `backend/wrangler.toml` with your IDs and API keys.

7. **Deploy**
```bash
npm run deploy
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure API URL**
Edit API base URL in `src/services/api.js`

3. **Run App**
```bash
# Android
npm run android

# iOS
npm run ios
```

## 🔧 Environment Variables

### Backend (.env)
```env
JWT_SECRET=your-jwt-secret
YOUTUBE_API_KEY=your-youtube-api-key
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
TRAKTEER_URL=https://trakteer.id/anichinapk
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 💝 Trakteer Integration

Aplikasi terintegrasi dengan Trakteer untuk donasi pengembang:

- **URL**: https://trakteer.id/anichinapk
- **Component**: `TrakteerButton.js`
- **API Endpoint**: `GET /api/donations/trakteer`

## 📱 Screenshots

[Coming soon]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Kang Dedi Mulyadi untuk inspirasi
- Cloudflare untuk platform yang luar biasa
- Trakteer untuk platform donasi
- React Native community

## 📞 Support

Untuk dukungan dan pertanyaan:
- Email: support@fans-kdm.com
- Trakteer: https://trakteer.id/anichinapk