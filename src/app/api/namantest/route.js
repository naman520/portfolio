// app/api/proxy-mno/route.js

export async function GET(req) {
  const response = await fetch('https://bigbucket.online/namanTest/login.php', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://bigbucket.online/namanTest',
    },
  });

  const html = await response.text();

  return new Response(html, {
    status: response.status,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}