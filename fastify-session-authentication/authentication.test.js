'use strict'

const { test } = require('tap')
const plugin = require('./authentication')
const axios = require('axios')
const fastify = require('fastify')

test('should be able to login', async (t) => {
  t.plan(3)
  
  const app = await server()
  const { port } = app.server.address()

  const result0 = await performLogin(port, 'abcdef')
  const result1 = await toHomePage(port, result0.sessionCookie)

  t.ok(result0.body.includes('logged in'))
  t.ok(result1.body.includes('logged in'))
  t.equal(result1.sessionCookie, result0.sessionCookie)
  app.close()
})
  
test('should not be able to login with wrong password', async (t) => {
  t.plan(2)

  const app = await server()
  const { port } = app.server.address()
  
  const { location, statusCode } = await performLogin(port, '123456')

  t.equal(location, '/login')
  t.equal(statusCode, 401)
  app.close()
})

test('should be not logged in', async (t) => {
  t.plan(2)

  const app = await server()
  const { port } = app.server.address()
  
  // login route
  const { sessionCookie, body } = await requestPath(port)

  t.ok(body.includes('please login'))
  t.ok(sessionCookie.includes('sessionId'))
  app.close()
})

test('should be able to logout', async (t) => {
  t.plan(4)

  const app = await server()
  const { port } = app.server.address()
  
  const result0 = await performLogin(port, 'abcdef')
  const result1 = await toHomePage(port, result0.sessionCookie)
  const result2 = await logout(port, result0.sessionCookie)
  const result3 = await toHomePage(port, result2.sessionCookie)

  t.ok(result1.body.includes('logged in'))
  t.ok(result3.body.includes('please login'))
  t.ok(result3.sessionCookie === result2.sessionCookie)
  t.ok(result0.sessionCookie !== result2.sessionCookie)
  app.close()
})

test('should be able to call logout if not logged in', async (t) => {
  t.plan(2)

  const app = await server()
  const { port } = app.server.address()
  
  // logout route
  const result0 = await requestPath(port, 'logout')
  const result1 = await toHomePage(port, result0.sessionCookie)
  
  t.ok(result1.body.includes('please login'))
  t.ok(result1.sessionCookie === result0.sessionCookie)
  app.close()
})

test('should be able to request login page', async (t) => {
  t.plan(1)
  
  const app = await server()
  const { port } = app.server.address()

  const { statusCode } = await toLoginPage(port)

  t.equal(statusCode, 200)
  app.close()
})

async function server() {
  const app = fastify()
  app.register(plugin)
  app.server.unref()
  await app.listen()
  return app
}

async function toHomePage(port, cookie) {
  return request({
    url: `http://localhost:${port}/`,
    method: 'GET',
    headers: { cookie }
  });
}

async function performLogin(port, password) {
  return request({
    url: `http://localhost:${port}/login`,
    method: 'POST',
    data: { email: 'test@test.de', password },
  });
}

async function toLoginPage(port) {
  return request({
    url: `http://localhost:${port}/login`,
    method: 'GET'
  });
}

async function logout(port, cookie) {
  return request({
    url: `http://localhost:${port}/logout`,
    method: 'GET',
    headers: { cookie }
  });
}

async function requestPath(port, path = '') {
  return request({
    url: `http://localhost:${port}/${path}`,
    method: 'GET'
  });
}

async function request (options) {
  try {
    const res = await axios.request(options)

    return {
      statusCode: res.status,
      body: res.data,
      sessionCookie: res.headers['set-cookie'][0],
      location: res.request.res.responseUrl
    }
  } catch (err) {
    return {
      body: err.response?.data,
      statusCode: err.response?.status,
      location: err.response?.headers?.location
    }
  }
}
