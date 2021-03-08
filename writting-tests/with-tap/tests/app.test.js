import fastify from 'fastify'
import { test } from 'tap-esm'
import app from '../app'

// // Test the default route
test('requests the "/" route', async (t) => {
  const app = app()

  const response = await app.inject({
    method: 'GET',
    url: '/',
  })

  t.strictEqual(response.statusCode, 200, 'returns a status code of 200')
})
