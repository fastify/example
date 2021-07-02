'use strict'

const GQL = require('fastify-gql')
const JWT = require('fastify-jwt')

function plugin (instance, options, next) {
  /**
   * Authentication settings
   */
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
      // Autorization logic
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  instance.addHook('onRoute', (routeOptions) => {
    if (routeOptions.url === '/graphql') {
      routeOptions.preValidation = [instance.authenticate]
    }
  })

  /**
   * GraphQL Stuff
   */
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

  // A protected /graphql endpoint is exposed
  instance.register(GQL, {
    schema,
    resolvers
  })

  // I can use the graphql also without authentication
  instance.get('/public', async function (req, reply) {
    const query = '{ add(x: 2, y: 2) }'
    return reply.graphql(query)
  })

  next()
}

module.exports = plugin
