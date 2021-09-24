'use strict'

const Fastify = require('fastify')
const fp = require('fastify-plugin')
const fastifyMongodb = require('fastify-mongodb')
const mongodb = require('mongodb')

function app(fastify, config, done) {
  fastify.register(fastifyMongodb, { client: config.mongodb.client })
  fastify.get('/', async function (_req, reply) {
    const db = this.mongo.client.db()
    const results = await db.collection('examples').find()
    return reply.send(results)
  })

  fastify.addHook('onClose', async () => {
    await config.mongodb.client.close()
  })
  done()
}

async function server() {
  const fastify = Fastify({ logger: true })
  const database = process.env.MONGO_URI || 'mongodb://localhost/prod'
  const client = await mongodb.MongoClient.connect(database)
  fastify.register(
    fp(app),
    {
      mongodb: {
        client,
        database,
      }
    }
  )

  fastify.listen(3000)
}

if (require.main === module) {
  server()
} else {
  module.exports = app
}

