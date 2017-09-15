'use strict'

const { test, beforeEach, afterEach } = require('tap')
const server = require('../server')
var fastify = null

beforeEach(done => {
  server.build({
    'log-level': 'silent'
  }, (err, instance) => {
    if (err) throw err
    fastify = instance
    done()
  })
})

afterEach(done => {
  fastify.close(done)
})

test('The server should start', t => {
  t.plan(2)

  fastify.inject({
    method: 'GET',
    url: '/status'
  }, res => {
    t.equal(res.statusCode, 200)
    t.deepEqual(JSON.parse(res.payload), { status: 'ok' })
  })
})
