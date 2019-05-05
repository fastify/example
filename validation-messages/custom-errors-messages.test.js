'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const plugin = require('./custom-errors-messages')

test('test the custom error message response', t => {
  t.plan(3)

  // create a fastify instance to run
  const fastify = Fastify()
  fastify.register(plugin)

  // usa this spacial method that simulate a HTTP request without starting the server!!
  fastify.inject({
    method: 'GET',
    url: '/'
  }, (err, res) => {
    // check the results of the response
    t.error(err) // if there is an error, the client request goes wrong

    // validate the output
    const jsonResponse = JSON.parse(res.payload)
    t.equal(res.statusCode, 400)
    t.equal(jsonResponse.message, 'querystring my custom message')
  })
})
