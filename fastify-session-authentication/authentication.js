'use strict'

const fastify = require('fastify')
const fastifySession = require('fastify-session')
const fastifyCookie = require('fastify-cookie')
const fastifyFormbody = require('fastify-formbody')

const { loginPage, defaultPage } = require('./html')

// create a fastify instance
const app = fastify()

// register the required plugins
app.register(fastifyFormbody)
app.register(fastifyCookie)
app.register(fastifySession, {
  cookieName: 'sessionId',
  secret: 'a secret with minimum length of 32 characters',
  cookie: { secure: false },
  expires: 1800000
})

// add a login route that returns a login page
app.get('/login', (request, reply) => {
  reply.type('text/html')
  reply.send(loginPage())
})

// add a login route that handles the actual login
app.post('/login', (request, reply) => {
  const { email, password } = request.body

  if (password === 'abcdef') {
    request.session.authenticated = true
    reply.redirect('/')
  } else {
    reply.redirect('/login')
  }
});

app.get('/', (request, reply) => {
  reply.type('text/html')
  reply.send(defaultPage(request.session.authenticated))
});

// add a logout route
app.get('/logout', (request, reply) => {
  if (request.session.authenticated) {
    request.destroySession((err) => {
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

// start the server
app.listen(3000, () => {
  console.log(`server started on port 3000`)
})
