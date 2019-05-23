'use strict'

const { test } = require('tap')
const server = require('./authentication')
const requestCallback = require('request')

server.then((app) => {
  app.server.unref()
  
  test('should be able to login', async (t) => {
    t.plan(3)
    
    const result0 = await performLogin('abcdef')
    const result1 = await toHomePage(result0.sessionCookie)
    
    t.equals(result0.location, '/')
    t.ok(result1.body.includes('logged in'))
    t.equals(result1.sessionCookie, result0.sessionCookie)
  })
  
  test('should not be able to login with wrong password', async (t) => {
    t.plan(2)
    
    const { location, statusCode } = await performLogin('123456')
  
    t.equals(location, '/login')
    t.equals(statusCode, 401)
  })

  test('should be not logged in', async (t) => {
    t.plan(2)
    
    const { sessionCookie, body } = await toHomePage()
  
    t.ok(body.includes('please login'))
    t.ok(sessionCookie.includes('sessionId'))
  })
  
  test('should be able to logout', async (t) => {
    t.plan(5)
    
    const result0 = await performLogin('abcdef')
    const result1 = await toHomePage(result0.sessionCookie)
    const result2 = await logout(result0.sessionCookie)
    const result3 = await toHomePage(result2.sessionCookie)
    
    t.equals(result0.location, '/')
    t.ok(result1.body.includes('logged in'))
    t.ok(result3.body.includes('please login'))
    t.ok(result3.sessionCookie === result2.sessionCookie)
    t.ok(result0.sessionCookie !== result2.sessionCookie)
  })
  
  test('should be able to call logout if not logged in', async (t) => {
    t.plan(2)
    
    const result0 = await logout()
    const result1 = await toHomePage(result0.sessionCookie)
    
    t.ok(result1.body.includes('please login'))
    t.ok(result1.sessionCookie === result0.sessionCookie)
  })
})

test('should be able to request login page', async (t) => {
  t.plan(1)
  const { statusCode } = await toLoginPage()

  t.equals(statusCode, 200)
})

async function toHomePage(cookie) {
  return request({
    url: 'http://localhost:3000/',
    method: 'GET',
    headers: { cookie }
  });
}

async function performLogin(password) {
  return request({
    url: 'http://localhost:3000/login',
    method: 'POST',
    form: { email: 'test@test.de', password },
    followRedirects: false
  });
}

async function toLoginPage() {
  return request({
    url: 'http://localhost:3000/login',
    method: 'GET'
  });
}

async function logout(cookie) {
  return request({
    url: 'http://localhost:3000/logout',
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
