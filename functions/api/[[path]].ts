// Cloudflare Pages Function to proxy API requests
export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Extract the path after /api/
  const apiPath = url.pathname.replace('/api/', '');
  
  // Build the target URL
  const targetUrl = `https://api.zhconvert.org/${apiPath}${url.search}`;
  
  // Forward the request to the actual API
  const apiRequest = new Request(targetUrl, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: request.method !== 'GET' ? await request.text() : undefined,
  });
  
  try {
    const response = await fetch(apiRequest);
    const data = await response.text();
    
    // Return with CORS headers
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
