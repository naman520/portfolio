// app/api/proxy-mno/route.js

const TARGET_URL = 'https://bigbucket.online/namantest/dashboard.php';

const commonHeaders = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://bigbucket.online/namantest',
};

export async function GET(req) {
  const res = await fetch(TARGET_URL, {
    headers: commonHeaders,
  });

  const html = await res.text();
  return new Response(html, {
    status: res.status,
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(req) {
  const body = await req.text();

  const res = await fetch(TARGET_URL, {
    method: 'POST',
    headers: {
      ...commonHeaders,
      'Content-Type': req.headers.get('content-type') || 'application/x-www-form-urlencoded',
    },
    body,
  });

  const html = await res.text();
  return new Response(html, {
    status: res.status,
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function PUT(req) {
  const body = await req.text();

  const res = await fetch(TARGET_URL, {
    method: 'PUT',
    headers: {
      ...commonHeaders,
      'Content-Type': req.headers.get('content-type') || 'application/json',
    },
    body,
  });

  const html = await res.text();
  return new Response(html, {
    status: res.status,
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function DELETE(req) {
  const res = await fetch(TARGET_URL, {
    method: 'DELETE',
    headers: commonHeaders,
  });

  const html = await res.text();
  return new Response(html, {
    status: res.status,
    headers: { 'Content-Type': 'text/html' },
  });
}
