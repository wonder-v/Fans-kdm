import { Router } from 'itty-router';
import { handleCORS } from './middleware/cors.js';
import { authMiddleware } from './middleware/auth.js';
import { videosRouter } from './routes/videos.js';
import { forumRouter } from './routes/forum.js';
import { eventsRouter } from './routes/events.js';
import { donationsRouter } from './routes/donations.js';
import { galleryRouter } from './routes/gallery.js';
import { authRouter } from './routes/auth.js';

const router = Router();

// CORS middleware
router.all('*', handleCORS);

// Health check
router.get('/health', () => {
  return new Response(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// API routes
router.all('/api/videos/*', videosRouter.handle);
router.all('/api/forum/*', forumRouter.handle);
router.all('/api/events/*', eventsRouter.handle);
router.all('/api/donations/*', donationsRouter.handle);
router.all('/api/gallery/*', galleryRouter.handle);
router.all('/api/auth/*', authRouter.handle);

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
});

export default {
  fetch: router.handle
};