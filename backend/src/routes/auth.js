import { Router } from 'itty-router';
import { sign, verify } from 'hono/jwt';

const router = Router();

// User registration
router.post('/register', async (request, env) => {
  try {
    const body = await request.json();
    const { username, email, password, full_name } = body;

    // Check if user already exists
    const existingUser = await env.DB.prepare(`
      SELECT id FROM users WHERE username = ? OR email = ?
    `).bind(username, email).first();

    if (existingUser) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Username or email already exists'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash password (in production, use proper hashing)
    const password_hash = btoa(password); // Simple encoding for demo

    // Create user
    const result = await env.DB.prepare(`
      INSERT INTO users (username, email, password_hash, full_name)
      VALUES (?, ?, ?, ?)
    `).bind(username, email, password_hash, full_name).run();

    // Generate JWT token
    const token = await sign({ 
      user_id: result.meta.last_row_id,
      username,
      email 
    }, env.JWT_SECRET);

    return new Response(JSON.stringify({
      success: true,
      data: {
        user_id: result.meta.last_row_id,
        username,
        email,
        full_name,
        token
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to register user'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// User login
router.post('/login', async (request, env) => {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Find user
    const user = await env.DB.prepare(`
      SELECT id, username, email, password_hash, full_name
      FROM users WHERE username = ? OR email = ?
    `).bind(username, username).first();

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify password
    const password_hash = btoa(password); // Simple encoding for demo
    if (user.password_hash !== password_hash) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate JWT token
    const token = await sign({ 
      user_id: user.id,
      username: user.username,
      email: user.email 
    }, env.JWT_SECRET);

    return new Response(JSON.stringify({
      success: true,
      data: {
        user_id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        token
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to login'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export { router as authRouter };