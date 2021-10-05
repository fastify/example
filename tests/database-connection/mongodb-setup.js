'use strict'

const Fastify = require('fastify')
const fp = require('fastify-plugin')

const clean = require('mongo-clean')
const { MongoClient } = require('mongodb')
const { beforeEach, teardown } = require('tap')

const App = require('../app')

const url = 'mongodb://localhost/prod'
const database = 'tests'

let client

beforeEach(async function () {
  if (!client) {
    client = await MongoClient.connect(url, {
      w: 1,
      useNewUrlParser: true
    })
  }
  await clean(client.db(database))
})

teardown(async function () {
  if (client) {
    await client.close()
    client = null
  }
})

// Fill in this config with all the configurations
// needed for testing the application
function config () {
  return {
    mongodb: {
      client,
      database
    }
  }
}

// automatically build and tear down our instance
function build (t) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  app.register(fp(App), config())

  // tear down our app after we are done
  t.teardown(app.close.bind(app))

  return app
}

module.exports = {
  build
}
