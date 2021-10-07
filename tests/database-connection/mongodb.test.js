const { test } = require('tap')
const { build } = require('./mongodb-setup')

test('GET / • returns 200', (t) => {
  t.plan(2);
  const fastify = build(t);

  fastify.inject(
    {
      method: 'GET',
      url: '/',
    },
    (err, response) => {
      t.error(err);
      t.strictEqual(response.statusCode, 200);
    },
  );
});
