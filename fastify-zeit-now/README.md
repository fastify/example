# fastify-zeit-now example

This example shows how to do run a Fastify server in [Zeit Now](https://zeit.co/).

This project can simply run:

```sh
cd fastify-zeit-now

# Test locally
npm install
npm start

# Deploy
npm run deploy
```

Then open `http://localhost:3000/` in your browser or the URL printed out after the deploy script.

The `package-lock.json` should be pushed otherwise yarn will be used during the installation as
specified in [docs](https://zeit.co/docs/v2/advanced/builders/#node.js-dependencies).
