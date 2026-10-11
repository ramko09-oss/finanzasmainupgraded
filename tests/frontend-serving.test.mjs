import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import express from '../backend/node_modules/express/index.js';
import { serveFrontend } from '../backend/frontend.js';

test('Express sirve React desde la raíz y los enlaces antiguos redirigen sin crear otra interfaz', async () => {
  const app = express();
  serveFrontend(app, fileURLToPath(new URL('../sidan-frontend/dist', import.meta.url)));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const response = await fetch(base);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /id="root"/);
    assert.doesNotMatch(html, /js\/app.js|Panel ampliado|react-dashboard-root/);
    const bundle = html.match(/src="([^"]+\.js)"/)[1];
    assert.equal((await fetch(base + bundle)).status, 200);
    assert.equal((await fetch(base + '/img/sidaa-logo.png')).status, 200);
    for (const path of ['/react', '/react/', '/react/historial']) {
      const redirect = await fetch(base + path, { redirect: 'manual' });
      assert.equal(redirect.status, 308);
      assert.equal(redirect.headers.get('location'), '/');
    }
    for (const path of ['/api/no-existe', '/js/app.js', '/assets/no-existe.js']) {
      const missing = await fetch(base + path);
      assert.equal(missing.status, 404);
      assert.match(missing.headers.get('content-type'), /application\/json/);
    }
    assert.equal((await fetch(base + '/historial')).status, 200);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
