'use strict'

const minimist = require('minimist')
const Fastify = require('fastify')

function build (opts, callback) {
  const fastify = Fastify({
    level: opts['log-level'] || (process.env.NODE_ENV === 'production' ? 'error' : 'info')
  })

  fastify.get('/status', (req, reply) => {
    reply.send({ status: 'ok' })
  })

  fastify.ready(err => {
    callback(err, fastify, opts)
  })
}

function onReady (err, instance, opts) {
  if (err) throw err
  instance.listen(opts.port, err => {
    if (err) throw err
    console.log(`server listening on ${instance.server.address().port}`)
  })
}

if (require.main === module) {
  build(minimist(process.argv.slice(2), {
    integer: ['port'],
    alias: {
      port: 'p',
      'log-level': 'L'
    },
    default: {
      port: 3000
    }
  }), onReady)
}

module.exports = { build }
