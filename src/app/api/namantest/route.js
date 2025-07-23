// app/api/namantest/route.js

const TARGET_DOMAIN = 'https://bigbucket.online';
const TARGET_BASE_PATH = '/namanTest';
const TARGET_URL = `${TARGET_DOMAIN}${TARGET_BASE_PATH}/dashboard.php`; // Default fallback
const BASE_URL = `${TARGET_DOMAIN}${TARGET_BASE_PATH}`;

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
  
  // Handle both single and multiple set-cookie headers
  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    // Split multiple cookies if they're in a single header
    const cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
    setCookieHeaders.push(...cookies);
  }
  
  // Also check for raw headers if available
  if (response.headers.raw && response.headers.raw()['set-cookie']) {
    setCookieHeaders.push(...response.headers.raw()['set-cookie']);
  }
  
  return setCookieHeaders;
}

// Enhanced HTML content modifier
function modifyHtmlContent(html, baseUrl, currentPath = '') {
  let modifiedHtml = html;
  
  // Enhanced form action handling
  modifiedHtml = modifiedHtml.replace(/action="([^"]*?)"/gi, (match, action) => {
    console.log('Processing form action:', action);
    if (action.startsWith('http') || action.startsWith('//')) return match;
    if (action === '' || action === '.') {
      return `action="/api/namantest${currentPath}"`;
    }
    if (action.startsWith('/')) {
      return `action="/api/namantest?path=${encodeURIComponent(action)}"`;
    }
    // Handle PHP files directly
    if (action.endsWith('.php')) {
      return `action="/api/namantest?path=${encodeURIComponent(action)}"`;
    }
    return `action="/api/namantest?path=${encodeURIComponent(currentPath + '/' + action)}"`;
  });

  // Enhanced href handling with better PHP file detection
  modifiedHtml = modifiedHtml.replace(/href="([^"]*?)"/gi, (match, href) => {
    console.log('Processing href:', href);
    if (href.startsWith('http') || href.startsWith('#') || 
        href.startsWith('mailto:') || href.startsWith('javascript:')) {
      return match;
    }
    if (href.startsWith('/')) {
      return `href="/api/namantest?path=${encodeURIComponent(href)}"`;
    }
    if (href === '' || href === '.') {
      return `href="/api/namantest?path=${encodeURIComponent(currentPath)}"`;
    }
    // Handle PHP files directly
    if (href.endsWith('.php')) {
      return `href="/api/namantest?path=${encodeURIComponent(href)}"`;
    }
    return `href="/api/namantest?path=${encodeURIComponent(currentPath + '/' + href)}"`;
  });
  
  // Fix src attributes for resources
  modifiedHtml = modifiedHtml.replace(/src="([^"]*?)"/g, (match, src) => {
    if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) return match;
    if (src.startsWith('/')) {
      return `src="${baseUrl}${src}"`;
    }
    return `src="${baseUrl}/${src}"`;
  });
  
  // Fix background images in CSS
  modifiedHtml = modifiedHtml.replace(/url\(["']?([^"')]*?)["']?\)/g, (match, url) => {
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('//')) return match;
    if (url.startsWith('/')) {
      return `url("${baseUrl}${url}")`;
    }
    return `url("${baseUrl}/${url}")`;
  });
  
  // Add base tag to help with relative URLs
  if (modifiedHtml.includes('<head>')) {
    modifiedHtml = modifiedHtml.replace('<head>', `<head>\n<base href="${baseUrl}/">`);
  }
  
  return modifiedHtml;
}

// SIMPLIFIED: Helper to construct target URL
function constructTargetUrl(path) {
  console.log('🔍 constructTargetUrl - Input path:', path);
  console.log('🔍 constructTargetUrl - Raw path type:', typeof path);
  
  // Handle empty or root path
  if (!path || path === '/' || path === '') {
    console.log('🔍 Empty path, returning default:', TARGET_URL);
    return TARGET_URL;
  }

  // Decode the path first
  let decodedPath = path;
  try {
    decodedPath = decodeURIComponent(path);
    console.log('🔍 Decoded path:', decodedPath);
  } catch (e) {
    console.log('🔍 Failed to decode path, using original:', path);
    decodedPath = path;
  }

  // Simple approach - if it's a PHP file, construct directly
  if (decodedPath.endsWith('.php')) {
    // Remove leading slash if present
    const cleanPath = decodedPath.startsWith('/') ? decodedPath.slice(1) : decodedPath;
    const finalUrl = `${BASE_URL}/${cleanPath}`;
    console.log('🔍 PHP file detected, final URL:', finalUrl);
    return finalUrl;
  }
  
  // If path starts with /namanTest, use it directly
  if (decodedPath.startsWith('/namanTest')) {
    const finalUrl = `${TARGET_DOMAIN}${decodedPath}`;
    console.log('🔍 namanTest path detected, final URL:', finalUrl);
    return finalUrl;
  }
  
  // For other paths, append to base URL
  const cleanPath = decodedPath.startsWith('/') ? decodedPath.slice(1) : decodedPath;
  const finalUrl = `${BASE_URL}/${cleanPath}`;
  console.log('🔍 Default construction, final URL:', finalUrl);
  return finalUrl;
}

export async function GET(req) {
  console.log('🚀 GET Request started');
  console.log('🚀 Request URL:', req.url);
  
  try {
    const { searchParams } = new URL(req.url);
    const requestedPath = searchParams.get('path') || '/';
    
    console.log('📝 GET Request - Requested Path:', requestedPath);
    console.log('📝 Search params:', Object.fromEntries(searchParams.entries()));
    
    const targetUrl = constructTargetUrl(requestedPath);
    console.log('🎯 GET - Final Target URL:', targetUrl);
    
    const targetHeaders = { ...commonHeaders };
    
    // Forward cookies from client
    forwardCookies(req, targetHeaders);
    
    // Set proper referer
    targetHeaders['Referer'] = BASE_URL + '/';
    
    console.log('📤 Request headers to target:', targetHeaders);
    
    const res = await fetch(targetUrl, {
      headers: targetHeaders,
      redirect: 'manual',
    });

    console.log('📥 Response status:', res.status);
    console.log('📥 Response headers:', Object.fromEntries(res.headers.entries()));

    // Handle 404 specifically
    if (res.status === 404) {
      console.log('❌ Target server returned 404 for:', targetUrl);
      return new Response(`Target file not found: ${targetUrl}`, { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Handle redirects
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) {
        console.log('🔄 Redirect detected:', location);
        
        let redirectPath;
        if (location.startsWith('http')) {
          const url = new URL(location);
          redirectPath = url.pathname + url.search + url.hash;
        } else {
          redirectPath = location;
        }
        
        console.log('🔄 Redirect path:', redirectPath);
        
        const setCookies = extractSetCookies(res);
        
        const responseHeaders = {
          'Location': `/api/namantest?path=${encodeURIComponent(redirectPath)}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        };
        
        if (setCookies.length > 0) {
          responseHeaders['Set-Cookie'] = setCookies;
        }
        
        return new Response(null, {
          status: 302,
          headers: responseHeaders,
        });
      }
    }

    const html = await res.text();
    console.log('📄 Received HTML length:', html.length);
    
    const modifiedHtml = modifyHtmlContent(html, BASE_URL, requestedPath);
    
    const setCookies = extractSetCookies(res);
    
    const responseHeaders = {
      'Content-Type': res.headers.get('content-type') || 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    if (setCookies.length > 0) {
      responseHeaders['Set-Cookie'] = setCookies;
    }

    console.log('✅ GET Request completed successfully');
    
    return new Response(modifiedHtml, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('💥 GET Proxy Error:', error);
    console.error('💥 Error stack:', error.stack);
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}

export async function POST(req) {
  console.log('🚀 POST Request started');
  console.log('🚀 Request URL:', req.url);
  
  try {
    const body = await req.text();
    const { searchParams } = new URL(req.url);
    const requestedPath = searchParams.get('path') || '/';
    
    console.log('📝 POST Request - Requested Path:', requestedPath);
    console.log('📝 POST Body:', body);
    
    const targetUrl = constructTargetUrl(requestedPath);
    console.log('🎯 POST - Final Target URL:', targetUrl);

    const targetHeaders = {
      ...commonHeaders,
      'Content-Type': req.headers.get('content-type') || 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body).toString(),
    };

    forwardCookies(req, targetHeaders);
    targetHeaders['Referer'] = BASE_URL + '/';
    targetHeaders['Origin'] = BASE_URL;
    
    console.log('📤 POST headers to target:', targetHeaders);

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: targetHeaders,
      body,
      redirect: 'manual',
    });

    console.log('📥 POST Response status:', res.status);

    // Handle 404 specifically
    if (res.status === 404) {
      console.log('❌ Target server returned 404 for POST:', targetUrl);
      return new Response(`Target file not found: ${targetUrl}`, { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Handle redirects
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) {
        console.log('🔄 POST Redirect detected:', location);
        
        let redirectPath;
        if (location.startsWith('http')) {
          const url = new URL(location);
          redirectPath = url.pathname + url.search + url.hash;
        } else {
          redirectPath = location;
        }
        
        const setCookies = extractSetCookies(res);
        
        const responseHeaders = {
          'Location': `/api/namantest?path=${encodeURIComponent(redirectPath)}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        };
        
        if (setCookies.length > 0) {
          responseHeaders['Set-Cookie'] = setCookies;
        }
        
        return new Response(null, {
          status: 302,
          headers: responseHeaders,
        });
      }
    }

    const html = await res.text();
    const modifiedHtml = modifyHtmlContent(html, BASE_URL, requestedPath);
    
    const setCookies = extractSetCookies(res);
    
    const responseHeaders = {
      'Content-Type': res.headers.get('content-type') || 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    if (setCookies.length > 0) {
      responseHeaders['Set-Cookie'] = setCookies;
    }

    console.log('✅ POST Request completed successfully');

    return new Response(modifiedHtml, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('💥 POST Proxy Error:', error);
    console.error('💥 Error stack:', error.stack);
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}

// Simplified other methods
export async function PUT(req) {
  return handleOtherMethods(req, 'PUT');
}

export async function DELETE(req) {
  return handleOtherMethods(req, 'DELETE');
}

async function handleOtherMethods(req, method) {
  console.log(`🚀 ${method} Request started`);
  
  try {
    const body = method !== 'DELETE' ? await req.text() : undefined;
    const { searchParams } = new URL(req.url);
    const requestedPath = searchParams.get('path') || '/';
    const targetUrl = constructTargetUrl(requestedPath);

    console.log(`📝 ${method} Request - Path:`, requestedPath);
    console.log(`🎯 ${method} - Final Target URL:`, targetUrl);

    const targetHeaders = { ...commonHeaders };
    
    if (body && method !== 'DELETE') {
      targetHeaders['Content-Type'] = req.headers.get('content-type') || 'application/json';
      targetHeaders['Content-Length'] = Buffer.byteLength(body).toString();
    }

    forwardCookies(req, targetHeaders);
    targetHeaders['Referer'] = BASE_URL + '/';

    const fetchOptions = {
      method,
      headers: targetHeaders,
      redirect: 'manual',
    };
    
    if (body) {
      fetchOptions.body = body;
    }

    const res = await fetch(targetUrl, fetchOptions);
    
    console.log(`📥 ${method} Response status:`, res.status);
    
    // Handle 404 specifically
    if (res.status === 404) {
      console.log(`❌ Target server returned 404 for ${method}:`, targetUrl);
      return new Response(`Target file not found: ${targetUrl}`, { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Handle redirects
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) {
        let redirectPath;
        if (location.startsWith('http')) {
          const url = new URL(location);
          redirectPath = url.pathname + url.search + url.hash;
        } else {
          redirectPath = location;
        }
        
        const setCookies = extractSetCookies(res);
        const responseHeaders = {
          'Location': `/api/namantest?path=${encodeURIComponent(redirectPath)}`,
        };
        
        if (setCookies.length > 0) {
          responseHeaders['Set-Cookie'] = setCookies;
        }
        
        return new Response(null, {
          status: 302,
          headers: responseHeaders,
        });
      }
    }

    const responseText = await res.text();
    const setCookies = extractSetCookies(res);
    
    const responseHeaders = {
      'Content-Type': res.headers.get('content-type') || 'text/html; charset=utf-8',
    };
    
    if (setCookies.length > 0) {
      responseHeaders['Set-Cookie'] = setCookies;
    }

    console.log(`✅ ${method} Request completed successfully`);

    return new Response(responseText, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`💥 ${method} Proxy Error:`, error);
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}