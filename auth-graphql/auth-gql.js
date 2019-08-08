'use strict'

const GQL = require('fastify-gql')
const JWT = require('fastify-jwt')

function plugin (instance, options, next) {
  instance.register(JWT, {
    secret: 'supersecret'
  })

  instance.post('/login', (req, reply) => {
    // some code to authenticate
    const token = instance.jwt.sign({ payload: { user: 'foo' } })
    reply.send(token)
  })

  instance.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  const schema = `
  type Query {
    add(x: Int, y: Int): Int
  }
`

  const resolvers = {
    Query: {
      add: async (_, { x, y }) => x + y
    }
  }

  instance.register(GQL, {
    schema,
    resolvers
  })

  instance.get('/public', async function (req, reply) {
    const query = '{ add(x: 2, y: 2) }'
    return reply.graphql(query)
  })

  instance.get('/private',
    {
      preValidation: [instance.authenticate]
    }, async function (req, reply) {
      const query = '{ add(x: 5, y: 5) }'
      return reply.graphql(query)
    })

  next()
}

module.exports = plugin
