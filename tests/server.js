'use strict'

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const app = require('./app')

async function server() {
  const fastify = Fastify({ logger: true })
  const database = process.env.MONGO_URI || 'mongodb://localhost/prod'
  fastify.register(
    fp(app),
    {
      mongodb: {
        url: database
      }
    }
  )

  fastify.listen(3000)
}

server()
