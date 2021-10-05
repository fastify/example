const Fastify = require('fastify')
const fp = require('fastify-plugin')
const mongodb = require('mongodb')
const app = require('./app')

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

server()
