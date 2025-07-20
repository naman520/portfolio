// app/api/proxy-mno/route.js

const TARGET_URL = 'https://bigbucket.online/namanTest/dashboard.php';
const BASE_URL = 'https://bigbucket.online/namanTest';

const commonHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

// Helper function to forward cookies from client to target server
function forwardCookies(clientRequest, targetHeaders) {
  const cookies = clientRequest.headers.get('cookie');
  if (cookies) {
    targetHeaders['Cookie'] = cookies;
  }
}

// Helper function to forward cookies from target server back to client
function extractSetCookies(response) {
  const setCookieHeaders = [];
  
  // Get all set-cookie headers from the response
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      setCookieHeaders.push(value);
    }
  });
  
  return setCookieHeaders;
}

// Helper function to modify HTML content to fix relative URLs
function modifyHtmlContent(html, baseUrl) {
  return html
    .replace(/action="([^"]*?)"/g, (match, action) => {
      if (action.startsWith('http')) return match;
      if (action.startsWith('/')) return `action="${baseUrl}${action}"`;
      return `action="${baseUrl}/${action}"`;
    })
    .replace(/href="([^"]*?)"/g, (match, href) => {
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return match;
      if (href.startsWith('/')) return `href="/api/proxy-mno?url=${encodeURIComponent(baseUrl + href)}"`;
      return `href="/api/proxy-mno?url=${encodeURIComponent(baseUrl + '/' + href)}"`;
    })
    .replace(/src="([^"]*?)"/g, (match, src) => {
      if (src.startsWith('http') || src.startsWith('data:')) return match;
      if (src.startsWith('/')) return `src="${baseUrl}${src}"`;
      return `src="${baseUrl}/${src}"`;
    });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url') || TARGET_URL;
    
    const targetHeaders = { ...commonHeaders };
    
    // Forward cookies from client
    forwardCookies(req, targetHeaders);
    
    // Forward referer
    const referer = req.headers.get('referer');
    if (referer) {
      targetHeaders['Referer'] = BASE_URL;
    }

    const res = await fetch(targetUrl, {
      headers: targetHeaders,
    });

    const html = await res.text();
    const modifiedHtml = modifyHtmlContent(html, BASE_URL);
    
    // Extract cookies from target response
    const setCookies = extractSetCookies(res);
    
    const responseHeaders = {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    // Forward set-cookie headers
    if (setCookies.length > 0) {
      responseHeaders['Set-Cookie'] = setCookies;
    }

    return new Response(modifiedHtml, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('GET Proxy Error:', error);
    return new Response('Proxy Error', { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.text();
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url') || TARGET_URL;

    const targetHeaders = {
      ...commonHeaders,
      'Content-Type': req.headers.get('content-type') || 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body).toString(),
    };

    // Forward cookies from client
    forwardCookies(req, targetHeaders);
    
    // Set proper referer for login forms
    targetHeaders['Referer'] = BASE_URL;
    
    // Forward origin header if present
    const origin = req.headers.get('origin');
    if (origin) {
      targetHeaders['Origin'] = BASE_URL;
    }

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: targetHeaders,
      body,
    });

    const html = await res.text();
    const modifiedHtml = modifyHtmlContent(html, BASE_URL);
    
    // Extract cookies from target response
    const setCookies = extractSetCookies(res);
    
    const responseHeaders = {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    // Forward set-cookie headers to maintain session
    if (setCookies.length > 0) {
      responseHeaders['Set-Cookie'] = setCookies;
    }

    return new Response(modifiedHtml, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('POST Proxy Error:', error);
    return new Response('Proxy Error', { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.text();
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url') || TARGET_URL;

    const targetHeaders = {
      ...commonHeaders,
      'Content-Type': req.headers.get('content-type') || 'application/json',
    };

    forwardCookies(req, targetHeaders);
    targetHeaders['Referer'] = BASE_URL;

    const res = await fetch(targetUrl, {
      method: 'PUT',
      headers: targetHeaders,
      body,
    });

    const html = await res.text();
    const setCookies = extractSetCookies(res);
    
    const responseHeaders = {
      'Content-Type': 'text/html; charset=utf-8',
    };
    
    if (setCookies.length > 0) {
      responseHeaders['Set-Cookie'] = setCookies;
    }

    return new Response(html, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('PUT Proxy Error:', error);
    return new Response('Proxy Error', { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url') || TARGET_URL;

    const targetHeaders = { ...commonHeaders };
    forwardCookies(req, targetHeaders);
    targetHeaders['Referer'] = BASE_URL;

    const res = await fetch(targetUrl, {
      method: 'DELETE',
      headers: targetHeaders,
    });

    const html = await res.text();
    const setCookies = extractSetCookies(res);
    
    const responseHeaders = {
      'Content-Type': 'text/html; charset=utf-8',
    };
    
    if (setCookies.length > 0) {
      responseHeaders['Set-Cookie'] = setCookies;
    }

    return new Response(html, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('DELETE Proxy Error:', error);
    return new Response('Proxy Error', { status: 500 });
  }
}