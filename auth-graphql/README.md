# fastify-jwt + fastify-gql example

This project can simply run by:

```sh
cd auth-graphql
npm start
```

Then try it running:

```sh
# endpoint always reachable
npm run try-me:public

# endpoint that fails if you are not authenticated
npm run try-me:private

# endpoint to grab the JWT token
npm run try-me:login

# endpoint to get the JWT token and call the private endpoint
npm run try-me:private:login
```
