'use strict'

const { test } = require('tap')
const plugin = require('./authentication')
const requestCallback = require('request')
const fastify = require('fastify')

test('should be able to login', async (t) => {
  t.plan(3)
  
  const { port } = await startServer()

  const result0 = await performLogin(port, 'abcdef')
  const result1 = await toHomePage(port, result0.sessionCookie)
  
  t.equals(result0.location, '/')
  t.ok(result1.body.includes('logged in'))
  t.equals(result1.sessionCookie, result0.sessionCookie)
})
  
test('should not be able to login with wrong password', async (t) => {
  t.plan(2)

  const { port } = await startServer()
  
  const { location, statusCode } = await performLogin(port, '123456')

  t.equals(location, '/login')
  t.equals(statusCode, 401)
})

test('should be not logged in', async (t) => {
  t.plan(2)

  const { port } = await startServer()
  
  const { sessionCookie, body } = await toHomePage(port)

  t.ok(body.includes('please login'))
  t.ok(sessionCookie.includes('sessionId'))
})

test('should be able to logout', async (t) => {
  t.plan(5)

  const { port } = await startServer()
  
  const result0 = await performLogin(port, 'abcdef')
  const result1 = await toHomePage(port, result0.sessionCookie)
  const result2 = await logout(port, result0.sessionCookie)
  const result3 = await toHomePage(port, result2.sessionCookie)
  
  t.equals(result0.location, '/')
  t.ok(result1.body.includes('logged in'))
  t.ok(result3.body.includes('please login'))
  t.ok(result3.sessionCookie === result2.sessionCookie)
  t.ok(result0.sessionCookie !== result2.sessionCookie)
})

test('should be able to call logout if not logged in', async (t) => {
  t.plan(2)

  const { port } = await startServer()
  
  const result0 = await logout(port)
  const result1 = await toHomePage(port, result0.sessionCookie)
  
  t.ok(result1.body.includes('please login'))
  t.ok(result1.sessionCookie === result0.sessionCookie)
})

test('should be able to request login page', async (t) => {
  t.plan(1)
  
  const { port } = await startServer()

  const { statusCode } = await toLoginPage(port)

  t.equals(statusCode, 200)
})

async function startServer () {
  const app = fastify()
  app.register(plugin)
  app.server.unref()
  await app.listen(0)
  return app.server.address()
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
    form: { email: 'test@test.de', password },
    followRedirects: false
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
    followRedirects: false,
    headers: { cookie }
  });
}

function request (options) {
  return new Promise((resolve, reject) => {
    requestCallback(options, (err, response, body) => {
      err ? reject(err) : resolve({
        statusCode: response.statusCode,
        body: body.toString(),
        sessionCookie: response.headers['set-cookie'][0],
        location: response.headers.location
      })
    })
  })
}
