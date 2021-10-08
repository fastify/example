'use strict'

const Fastify = require('fastify')
const fp = require('fastify-plugin')

const clean = require('mongo-clean')

const App = require('../app')

const url = 'mongodb://localhost/prod'
const database = 'tests'

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {
    mongodb: {
      url,
    }
  }
}

// automatically build and tear down our instance
function build (t) {
  const app = Fastify()
  app.register(fp(App), config())

  t.teardown(async () => {
    await clean(app.mongo.client.db(database))
    await app.close()
  })
  return app
}

module.exports = {
  build
}
