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
    if (action.startsWith('http') || action.startsWith('//')) return match;
    if (action === '' || action === '.') {
      return `action="/api/namantest${currentPath}"`;
    }
    if (action.startsWith('/')) {
      return `action="/api/namantest?path=${encodeURIComponent(action)}"`;
    }
    return `action="/api/namantest?path=${encodeURIComponent(currentPath + '/' + action)}"`;
  });

  // Enhanced href handling
  modifiedHtml = modifiedHtml.replace(/href="([^"]*?)"/gi, (match, href) => {
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

// FIXED: Helper to construct target URL with better PHP file handling
function constructTargetUrl(path) {
  console.log('Input path:', path); // Debug log
  
  // Handle empty or root path
  if (!path || path === '/' || path === '') {
    return TARGET_URL; // Default to dashboard.php
  }

  // Remove leading slash if present for processing
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Handle direct PHP files (logout.php, edit.php, etc.)
  if (cleanPath.endsWith('.php')) {
    const finalUrl = `${BASE_URL}/${cleanPath}`;
    console.log('PHP file URL:', finalUrl); // Debug log
    return finalUrl;
  }
  
  // Handle paths that already include the base path
  if (path.startsWith(TARGET_BASE_PATH)) {
    const finalUrl = `${TARGET_DOMAIN}${path}`;
    console.log('Full path URL:', finalUrl); // Debug log
    return finalUrl;
  }
  
  // Handle paths starting with /namanTest/ directly
  if (path.startsWith('/namanTest/')) {
    const finalUrl = `${TARGET_DOMAIN}${path}`;
    console.log('namanTest path URL:', finalUrl); // Debug log
    return finalUrl;
  }

  // For other paths, append to base URL
  const finalUrl = `${BASE_URL}/${cleanPath}`;
  console.log('Default constructed URL:', finalUrl); // Debug log
  return finalUrl;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedPath = searchParams.get('path') || '/';
    console.log('GET Request - Path:', requestedPath);
    
    const targetUrl = constructTargetUrl(requestedPath);
    console.log('GET - Final Target URL:', targetUrl);
    
    const targetHeaders = { ...commonHeaders };
    
    // Forward cookies from client
    forwardCookies(req, targetHeaders);
    
    // Set proper referer
    targetHeaders['Referer'] = BASE_URL + '/';
    
    // Forward other important headers
    const xRequestedWith = req.headers.get('x-requested-with');
    if (xRequestedWith) {
      targetHeaders['X-Requested-With'] = xRequestedWith;
    }

    const res = await fetch(targetUrl, {
      headers: targetHeaders,
      redirect: 'manual', // Handle redirects manually
    });

    console.log('Response status:', res.status); // Debug log

    // Handle redirects
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) {
        console.log('Redirect detected:', location);
        
        // Convert the redirect location to our proxy format
        let redirectPath;
        if (location.startsWith('http')) {
          // Absolute URL - extract the path
          const url = new URL(location);
          redirectPath = url.pathname + url.search + url.hash;
        } else {
          // Relative URL
          redirectPath = location;
        }
        
        // Extract and forward cookies from redirect response
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
    
    // Extract cookies from target response
    const setCookies = extractSetCookies(res);
    
    const responseHeaders = {
      'Content-Type': res.headers.get('content-type') || 'text/html; charset=utf-8',
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
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.text();
    const { searchParams } = new URL(req.url);
    const requestedPath = searchParams.get('path') || '/';
    const targetUrl = constructTargetUrl(requestedPath);
    
    console.log('POST Request - Path:', requestedPath);
    console.log('POST - Final Target URL:', targetUrl);
    console.log('POST Body:', body);

    const targetHeaders = {
      ...commonHeaders,
      'Content-Type': req.headers.get('content-type') || 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body).toString(),
    };

    // Forward cookies from client
    forwardCookies(req, targetHeaders);
    
    // Set proper referer and origin for forms
    targetHeaders['Referer'] = BASE_URL + '/';
    targetHeaders['Origin'] = BASE_URL;
    
    // Forward X-Requested-With for AJAX requests
    const xRequestedWith = req.headers.get('x-requested-with');
    if (xRequestedWith) {
      targetHeaders['X-Requested-With'] = xRequestedWith;
    }

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: targetHeaders,
      body,
      redirect: 'manual', // Handle redirects manually
    });

    console.log('POST Response status:', res.status); // Debug log

    // Handle redirects (common after login)
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) {
        console.log('POST Redirect detected:', location);
        
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
    
    // Extract cookies from target response
    const setCookies = extractSetCookies(res);
    
    const responseHeaders = {
      'Content-Type': res.headers.get('content-type') || 'text/html; charset=utf-8',
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
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}

// Keep the other HTTP methods simple for now
export async function PUT(req) {
  return handleOtherMethods(req, 'PUT');
}

export async function DELETE(req) {
  return handleOtherMethods(req, 'DELETE');
}

async function handleOtherMethods(req, method) {
  try {
    const body = method !== 'DELETE' ? await req.text() : undefined;
    const { searchParams } = new URL(req.url);
    const requestedPath = searchParams.get('path') || '/';
    const targetUrl = constructTargetUrl(requestedPath);

    console.log(`${method} Request - Path:`, requestedPath);
    console.log(`${method} - Final Target URL:`, targetUrl);

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
    
    console.log(`${method} Response status:`, res.status); // Debug log
    
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

    return new Response(responseText, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`${method} Proxy Error:`, error);
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}