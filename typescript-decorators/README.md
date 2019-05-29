# Typescript decorators

Example how to use typescript decorators with Fastify to build controllers with handlers and hooks

This example uses Fastify `^2.0.0` framework and fastify-decorators `^1.1.0`. In other versions typings could be different.

Check now the [source code directory](src)! You will find all the info there in the comments.

You can run this project simply by:

 ```sh
cd typescript-decorators
npm i
npm run build
npm start
```

## How it works
1. Each controller (for example [main.controller.ts]) has `Controller` decorators
1. Each controller's handler has `GET`, `POST` or other method decorators
1. [typescript-decorators.ts] contains `bootstrap` method to auto-load all controllers 
1. [app.js] require Fastify instance from [typescript-decorators.ts] and launch application

For more details take a look on [fastify-decorators] package.

**NOTE**: `experimentalDecorators` should be enabled in [typescript config]

**NOTE**: give a look also to the [`package.json`](./package.json) to find out how the scripts are done 😉

[main.controller.ts]: src/controllers/main.controller.ts
[typescript-decorators.ts]: ./src/typescript-decorators.ts
[typescript config]: ./tsconfig.json
[app.js]: ./bin/app.js
[fastify-decorators]: https://npmjs.org/package/fastify-decorators
