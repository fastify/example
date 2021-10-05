const fastifyMongodb = require('fastify-mongodb')

function app(fastify, config, done) {
  fastify.register(fastifyMongodb, { client: config.mongodb.client })
  fastify.get('/', async function (_req, reply) {
    const db = this.mongo.client.db()
    const results = await db.collection('examples').find()
    return reply.send(results)
  })

  fastify.addHook('onClose', async () => {
    await fastif.mongo.client.close()
  })
  done()
}

module.exports = app
