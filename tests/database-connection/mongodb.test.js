const { test } = require('node:test')
const { build } = require('./mongodb-setup')

test('GET / • returns 200', async (t) => {
  t.plan(2);
  const fastify = build(t);

  const response = await fastify.inject(
    {
      method: 'GET',
      url: '/',
    });

  t.assert.strictEqual(response.statusCode, 200);
});
