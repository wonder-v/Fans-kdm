import { verify } from 'hono/jwt';

export async function authMiddleware(request, env) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Missing or invalid authorization header'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = authHeader.substring(7);
  
  try {
    const payload = await verify(token, env.JWT_SECRET);
    request.user = payload;
    return null; // Continue to next handler
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid or expired token'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
