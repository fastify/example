"use strict";

const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/fastify_postgres?schema=public";

(async function () {
  const client = new Client({ connectionString });
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS books (
      id serial PRIMARY KEY,
      title varchar (255) NOT NULL
    )
  `);
  await client.end();
})();
