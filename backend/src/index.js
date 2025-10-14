import { Router } from 'itty-router';
import { handleCORS, addCORSHeaders } from './middleware/cors.js';
import { authMiddleware } from './middleware/auth.js';
import { videosRouter } from './routes/videos.js';
import { forumRouter } from './routes/forum.js';
import { eventsRouter } from './routes/events.js';
import { donationsRouter } from './routes/donations.js';
import { galleryRouter } from './routes/gallery.js';
import { authRouter } from './routes/auth.js';

const router = Router();

// CORS preflight handler
router.all('*', handleCORS);

// Health check
router.get('/health', (request) => {
  return new Response(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// API routes - properly handle sub-routes
router.all('/api/videos/*', (request, env, ctx) => videosRouter.handle(request, env, ctx));
router.all('/api/forum/*', (request, env, ctx) => forumRouter.handle(request, env, ctx));
router.all('/api/events/*', (request, env, ctx) => eventsRouter.handle(request, env, ctx));
router.all('/api/donations/*', (request, env, ctx) => donationsRouter.handle(request, env, ctx));
router.all('/api/gallery/*', (request, env, ctx) => galleryRouter.handle(request, env, ctx));
router.all('/api/auth/*', (request, env, ctx) => authRouter.handle(request, env, ctx));

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
});

export default {
  async fetch(request, env, ctx) {
    try {
      const response = await router.handle(request, env, ctx);
      return addCORSHeaders(response, request);
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Internal Server Error',
        message: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};