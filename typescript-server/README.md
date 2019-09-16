# typescript server
## dev
```
$ yarn dev
```

## build && start
```
$ yarn build
$ yarn start
```

## note
when use typescript to build sever application, we highly
recommend set `esModuleInterop` to true to avoid lots of interop
 problems between `esm` and `commonjs`, when set `esModuleInterop` to true, use `import fastify from 'fastify'` instead of `import * as fastify from 'fastify'`
 
