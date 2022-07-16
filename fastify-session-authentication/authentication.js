'use strict'

const fastify = require('fastify')
const fastifySession = require('@fastify/session')
const fastifyCookie = require('@fastify/cookie')
const fastifyFormbody = require('@fastify/formbody')

const { loginPage, defaultPage } = require('./html')

function plugin (instance, options, next) {
  // register the required plugins
  instance.register(fastifyFormbody)
  instance.register(fastifyCookie)
  instance.register(fastifySession, {
    cookieName: 'sessionId',
    secret: 'a secret with minimum length of 32 characters',
    cookie: { secure: false },
    expires: 1800000
  })

  // add a login route that returns a login page
  instance.get('/login', (request, reply) => {
    reply.type('text/html')
    reply.send(loginPage())
  })
  
  // add a login route that handles the actual login
  instance.post('/login', (request, reply) => {
    const { email, password } = request.body
  
    if (password === 'abcdef') {
      request.session.authenticated = true
      reply.redirect('/')
    } else {
      reply.redirect(401, '/login')
    }
  });

  instance.get('/', (request, reply) => {
    reply.type('text/html')
    reply.send(defaultPage(request.session.authenticated))
  });
  
  // add a logout route
  instance.get('/logout', (request, reply) => {
    if (request.session.authenticated) {
      request.session.destroy((err) => {
        if (err) {
          reply.status(500)
          reply.send('Internal Server Error')
        } else {
          reply.redirect('/')
        }
      })
    } else {
      reply.redirect('/')
    }
  });

  next()
}

module.exports = plugin
