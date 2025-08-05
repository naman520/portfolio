// app/api/namantest/route.js

const TARGET_DOMAIN = "https://bigbucket.online";
const TARGET_BASE_PATH = "/namanTest";
const TARGET_URL = `${TARGET_DOMAIN}${TARGET_BASE_PATH}/dashboard.php`;
const BASE_URL = `${TARGET_DOMAIN}${TARGET_BASE_PATH}`;

const commonHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
};

// Helper function to forward cookies
function forwardCookies(clientRequest, targetHeaders) {
  const cookies = clientRequest.headers.get("cookie");
  if (cookies) {
    targetHeaders["Cookie"] = cookies;
  }
}

// Robust cookie extraction
function extractSetCookies(response) {
  const setCookieHeaders = [];
  
  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    const cookies = setCookieHeader.split(/\s*,\s*(?=[^;]+;)/);
    setCookieHeaders.push(...cookies);
  }
  
  if (typeof response.headers.raw === 'function') {
    const rawSetCookies = response.headers.raw()['set-cookie'] || [];
    setCookieHeaders.push(...rawSetCookies);
  }
  
  return setCookieHeaders;
}

// Standardized URL construction with PDF handling
function constructTargetUrl(path) {
  // Handle PDF generation requests
  if (path.includes('generate_pdf.php')) {
    const cleanPath = decodeURIComponent(path)
      .replace(/^[^?]*[\/]([^?]+\.php\?[^"]+)/, '$1');
    return `${BASE_URL}/${cleanPath}`;
  }

  // Handle empty/root path
  if (!path || path === '/' || path === '') {
    return TARGET_URL;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Special cases
  if (cleanPath === 'favicon.ico') {
    return `${TARGET_DOMAIN}/favicon.ico`;
  }

  // All other cases
  return `${BASE_URL}/${cleanPath}`;
}

// Enhanced HTML content modifier with PDF link handling
function modifyHtmlContent(html, currentPath = "") {
  // Normalize currentPath
  currentPath = currentPath.replace(/\/+$/, '');

  let modifiedHtml = html
    // Rewrite href attributes
    .replace(/href="([^"]*?)"/gi, (match, href) => {
      if (href.startsWith('http') || href.startsWith('//') || 
          href.startsWith('#') || href.startsWith('mailto:') || 
          href.startsWith('javascript:')) {
        return match;
      }
      
      // Handle absolute paths
      if (href.startsWith('/')) {
        return `href="/api/namantest?path=${encodeURIComponent(href)}"`;
      }
      
      // Handle PHP files
      if (href.endsWith('.php')) {
        return `href="/api/namantest?path=${encodeURIComponent(href)}"`;
      }
      
      // Handle relative paths
      return `href="/api/namantest?path=${encodeURIComponent(
        currentPath ? `${currentPath}/${href}` : href
      )}"`;
    })
    
    // Special handling for PDF generation links
    .replace(
      /href="([^"]*?(?:dashboard\.php[\/%]?)?generate_pdf\.php\?index=\d+[^"]*?)"/gi,
      (match, href) => {
        if (href.startsWith('http')) return match;
        
        const pdfPath = href.replace(/^[^?]*[\/%]([^?]+\.php\?[^"]+)/, '$1');
        return `href="/api/namantest?path=${encodeURIComponent(pdfPath)}"`;
      }
    )
    
    // Rewrite form actions
    .replace(/action="([^"]*?)"/gi, (match, action) => {
      if (action.startsWith('http') || !action) return match;
      
      if (action.startsWith('/')) {
        return `action="/api/namantest?path=${encodeURIComponent(action)}"`;
      }
      
      return `action="/api/namantest?path=${encodeURIComponent(
        currentPath ? `${currentPath}/${action}` : action
      )}"`;
    })
    
    // Fix src attributes for resources
    .replace(/src="([^"]*?)"/g, (match, src) => {
      if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) {
        return match;
      }
      return `src="${BASE_URL}/${src.startsWith('/') ? src.slice(1) : src}"`;
    })
    
    // Fix background images in CSS
    .replace(/url\(["']?([^"')]*?)["']?\)/g, (match, url) => {
      if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('//')) {
        return match;
      }
      return `url("${BASE_URL}/${url.startsWith('/') ? url.slice(1) : url}")`;
    });

  // Modify JavaScript code that makes requests
  modifiedHtml = modifiedHtml
    .replace(/(fetch|axios|jQuery\.ajax|XMLHttpRequest|\.post|\.get)\(['"]([^'"]*?)['"]/g, 
      (match, method, url) => {
        if (url.startsWith('http') || url.startsWith('//')) return match;
        
        if (url.includes('.php') || url.startsWith('/api/')) {
          return `${method}('/api/namantest?path=${encodeURIComponent(
            url.startsWith('/') ? url.slice(1) : url
          )}'`;
        }
        return match;
      })
    
    .replace(/(\.action|formAction|\.submit|\.url)\s*=\s*['"]([^'"]*?)['"]/g,
      (match, prop, url) => {
        if (url.startsWith('http') || url.startsWith('//')) return match;
        return `${prop} = '/api/namantest?path=${encodeURIComponent(
          url.startsWith('/') ? url.slice(1) : url
        )}'`;
      });

  // Add base tag if missing
  if (!modifiedHtml.includes('<base href="')) {
    modifiedHtml = modifiedHtml.replace(
      /<head>/i, 
      '<head>\n<base href="${BASE_URL}/">'
    );
  }

  return modifiedHtml;
}

// Unified request handler
async function handleRequest(req, method = 'GET') {
  try {
    const { searchParams } = new URL(req.url);
    let requestedPath = searchParams.get("path") || "/";
    
    // Clean up PDF generation paths
    if (requestedPath.includes('generate_pdf.php')) {
      requestedPath = decodeURIComponent(requestedPath)
        .replace(/^[^?]*[\/]([^?]+\.php\?[^"]+)/, '$1');
    }

    const targetUrl = constructTargetUrl(requestedPath);
    const targetHeaders = { ...commonHeaders };
    
    forwardCookies(req, targetHeaders);
    
    const refererUrl = new URL(req.url);
    targetHeaders.Referer = `${refererUrl.origin}/api/namantest`;
    if (method !== 'GET') {
      targetHeaders.Origin = refererUrl.origin;
      targetHeaders['X-Requested-With'] = 'XMLHttpRequest';
    }

    const body = method !== 'GET' ? await req.text() : undefined;
    if (body && method !== 'GET') {
      targetHeaders['Content-Type'] = req.headers.get('content-type') || 'application/x-www-form-urlencoded';
      targetHeaders['Content-Length'] = Buffer.byteLength(body).toString();
    }

    const response = await fetch(targetUrl, {
      method,
      headers: targetHeaders,
      body,
      redirect: 'manual'
    });

    // Handle PDF responses differently
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/pdf')) {
      return new Response(await response.blob(), {
        status: response.status,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': response.headers.get('content-disposition') || 'inline',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // Handle redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        let redirectPath = location;
        if (location.startsWith('http')) {
          const url = new URL(location);
          if (url.hostname === new URL(TARGET_DOMAIN).hostname) {
            redirectPath = url.pathname;
          } else {
            return new Response(null, {
              status: response.status,
              headers: {
                Location: location,
                'Set-Cookie': extractSetCookies(response),
                'Cache-Control': 'no-cache, no-store, must-revalidate'
              }
            });
          }
        }
        return new Response(null, {
          status: 302,
          headers: {
            Location: `/api/namantest?path=${encodeURIComponent(redirectPath)}`,
            'Set-Cookie': extractSetCookies(response),
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
    }

    const contentType2 = response.headers.get('content-type') || '';
    const responseText = await response.text();

    if (contentType2.includes('application/json')) {
      return new Response(responseText, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Set-Cookie': extractSetCookies(response)
        }
      });
    }

    if (contentType2.includes('text/html')) {
      const modifiedHtml = modifyHtmlContent(responseText, requestedPath);
      return new Response(modifiedHtml, {
        status: response.status,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Set-Cookie': extractSetCookies(response)
        }
      });
    }

    return new Response(responseText, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Set-Cookie': extractSetCookies(response)
      }
    });
  } catch (error) {
    console.error(`Proxy Error:`, error);
    return new Response(`Proxy Error: ${error.message}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Export HTTP methods
export async function GET(req) {
  return handleRequest(req, 'GET');
}

export async function POST(req) {
  return handleRequest(req, 'POST');
}

export async function PUT(req) {
  return handleRequest(req, 'PUT');
}

export async function DELETE(req) {
  return handleRequest(req, 'DELETE');
}