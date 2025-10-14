export function handleCORS(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8081',
    'https://fans-kdm.vercel.app',
    'https://fans-kdm.netlify.app'
  ];

  const isAllowedOrigin = allowedOrigins.includes(origin);

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
}

export function addCORSHeaders(response, request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8081',
    'https://fans-kdm.vercel.app',
    'https://fans-kdm.netlify.app'
  ];

  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin : '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}