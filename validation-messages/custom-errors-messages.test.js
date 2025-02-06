'use strict'

const { test } = require('node:test')
const Fastify = require('fastify')
const plugin = require('./custom-errors-messages')

test('test the custom error message response', async t => {
  t.plan(2)

  // create a fastify instance to run
  const fastify = Fastify()
  fastify.register(plugin)

  // usa this spacial method that simulate a HTTP request without starting the server!!
  const res = await fastify.inject({
    method: 'GET',
    url: '/'
  })

  // validate the output
  t.assert.deepStrictEqual(res.statusCode, 400)
  t.assert.deepStrictEqual(res.json().message, 'querystring my custom message')
})
