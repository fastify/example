"use strict";

const fastify = require("fastify");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/fastify_postgres?schema=public";

function build(opts = {}) {
  const app = fastify(opts);

  app.register(require("fastify-postgres"), { connectionString });

  app.get("/", async (_request, reply) => {
    const client = await app.pg.connect();
    const { rows } = await client.query("SELECT * FROM books");
    client.release();
    reply.send(rows);
  });

  app.post("/", async (request, reply) => {
    const { body } = request;
    const client = await app.pg.connect();
    const { rows } = await client.query(
      "INSERT INTO books (title) VALUES ($1) RETURNING *",
      [body.title]
    );
    client.release();
    reply.send(rows);
  });

  app.get("/:id", async (request, reply) => {
    const { params } = request;
    const client = await app.pg.connect();
    const { rows } = await client.query("SELECT * FROM books WHERE id = $1", [
      +params.id,
    ]);
    client.release();
    reply.send(rows);
  });

  app.patch("/:id", async (request) => {
    const { params, body } = request;
    return app.pg.transact(async (client) => {
      await client.query("UPDATE books SET title = $1 WHERE id = $2", [
        body.title,
        +params.id,
      ]);
      const { rows } = await client.query("SELECT * FROM books WHERE id = $1", [
        +params.id,
      ]);
      return rows;
    });
  });

  app.delete("/:id", async (request, reply) => {
    const { params } = request;
    const client = await app.pg.connect();
    const { rowCount } = await client.query("DELETE FROM books WHERE id = $1", [
      +params.id,
    ]);
    client.release();
    reply.send({ rowCount });
  });

  return app;
}

module.exports = build;
