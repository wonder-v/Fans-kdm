export function handleCORS(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8081',
    'https://fans-kdm.vercel.app',
    'https://fans-kdm.netlify.app'
  ];

  const isAllowedOrigin = allowedOrigins.includes(origin) || !origin;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  return null;
}

export function addCORSHeaders(response, request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8081',
    'https://fans-kdm.vercel.app',
    'https://fans-kdm.netlify.app'
  ];

  const isAllowedOrigin = allowedOrigins.includes(origin) || !origin;

  response.headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : allowedOrigins[0]);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  return response;
}