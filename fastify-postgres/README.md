# Fastify Postgres CRUD

Motivation, this simple app are meant to show on how to use Postgres alongside with Fastify, and to show how to achieve 100% test coverage with it.

## Requirements

- Docker & Docker Compose
- Node.js

## How to run?

With npm

```
$ npm start:db // start postgres db with docker
$ npm install
$ npm start

# testing
$ npm test
```

With docker compose

```
# migration
$ docker-compose -f docker-compose.yaml -f compose-file/migration.yaml --exit-code-from fastify_postgres

# run the app
$ docker-compose up

# testing
$ docker-compose -f docker-compose.yaml -f compose-file/test.yaml --exit-code-from fastify_postgres
```
