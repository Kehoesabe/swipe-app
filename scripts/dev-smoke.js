// scripts/dev-smoke.js
// Simple preflight to detect "localhost refused" problems before you pick up your phone.
const http = require('http');

const port = process.env.PORT || 9000;
const host = process.env.HOST || '127.0.0.1';

function check() {
  return new Promise((resolve) => {
    const req = http.get({ host, port, path: '/', timeout: 1500 }, (res) => {
      // Expo dev server often returns JSON or a small html—status 200/302 is good enough
      const ok = res.statusCode && res.statusCode >= 200 && res.statusCode < 400;
      resolve({ ok, status: res.statusCode });
      res.resume();
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, status: 'TIMEOUT' });
    });
    req.on('error', () => resolve({ ok: false, status: 'CONN_ERR' }));
  });
}

(async () => {
  const { ok, status } = await check();
  if (!ok) {
    console.error(
      `❌ Metro not reachable at http://${host}:${port} (status: ${status}).\n` +
      `Try:\n` +
      `  taskkill /IM node.exe /F 2>NUL\n` +
      `  npx expo start --clear --tunnel --port ${port}\n` +
      `Or use LAN with your IPv4 and enter exp://<IPv4>:${port} in Expo Go.`
    );
    process.exit(1);
  } else {
    console.log(`✅ Metro reachable at http://${host}:${port} (status: ${status}).`);
  }
})();