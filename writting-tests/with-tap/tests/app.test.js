'use strict'

const fastify = require('fastify')
const { test } = require('tap')
const build = require('../app')

// Test the default route
test('requests the "/" route', async (t) => {
  const app = build()

  const response = await app.inject({
    method: 'GET',
    url: '/',
  })

  t.strictEqual(response.statusCode, 200, 'returns a status code of 200')
})

// How test get request with query parameters
// test("should get params from url", async (t) => {
//   try {
//     const res = await fastify.inject({ method: "POST", url: "/1232" });
//     console.log(res.statusCode);
//   } catch (error) {
//     console.error({ error });
//   }
// });
