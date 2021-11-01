"use strict";

const fastify = require("fastify");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/fastify_postgres?schema=public";

function build(opts = {}) {
  const app = fastify(opts);

  app.register(require("fastify-postgres"), { connectionString });

  app.get("/", async () => {
    const client = await app.pg.connect();
    const { rows } = await client.query("SELECT * FROM books");
    client.release();
    return rows;
  });

  app.post("/", async (request) => {
    const { body } = request;
    const client = await app.pg.connect();
    const { rows } = await client.query(
      "INSERT INTO books (title) VALUES ($1) RETURNING *",
      [body.title]
    );
    client.release();
    return rows;
  });

  app.get("/:id", async (request) => {
    const { params } = request;
    const client = await app.pg.connect();
    const { rows } = await client.query("SELECT * FROM books WHERE id = $1", [
      +params.id,
    ]);
    client.release();
    return rows;
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

  app.delete("/:id", async (request) => {
    const { params } = request;
    const client = await app.pg.connect();
    const { rowCount } = await client.query("DELETE FROM books WHERE id = $1", [
      +params.id,
    ]);
    client.release();
    return { rowCount };
  });

  return app;
}

module.exports = build;
