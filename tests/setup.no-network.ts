// Blocks accidental live HTTP calls in tests/CI unless explicitly allowed.
// Enable with env: BLOCK_LIVE_NETWORK=true
const shouldBlock =
  process.env.BLOCK_LIVE_NETWORK === 'true' ||
  process.env.CI === 'true';

function block(message: string) {
  throw new Error(
    `[NO-NETWORK] ${message}. Live calls are forbidden in tests/CI. ` +
    `Mock adapters or provide fixtures.`
  );
}

if (shouldBlock) {
  // fetch
  if (typeof global.fetch === 'function') {
    const og = global.fetch;
    global.fetch = (input: any, init?: any) => {
      const url = typeof input === 'string' ? input : input?.url ?? '';
      if (/^https?:\/\//i.test(url)) block(`fetch(${url})`);
      return og(input, init);
    };
  }

  // axios (if present)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const axios = require('axios').default || require('axios');
    axios.interceptors.request.use((config: any) => {
      const url = String(config.url || '');
      if (/^https?:\/\//i.test(url)) block(`axios(${url})`);
      return config;
    });
  } catch (_) {
    // axios not installed—ignore
  }
}
