"use strict";

const {test} = require("node:test");
const fastify = require("./server");

test("should test all API endpoint", async (t) => {
  let book = {};

  const app = await fastify();

  t.after(() => app.close());
  // only to test error path
  await t.test("POST / should success create item", async (t) => {
    const response = await app.inject({
      method: "POST",
      url: "/",
      payload: {
        title: "Hello, World!",
      },
    });
    const json = response.json();
    t.assert.deepStrictEqual(response.statusCode, 200);
    t.assert.deepStrictEqual(json[0].title, "Hello, World!");
    // assign created to use as compare value
    book = json[0];
  });

  await t.test("GET / should success return items", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });
    const json = response.json();
    t.assert.deepStrictEqual(response.statusCode, 200);
    t.assert.deepStrictEqual(json.length > 0, true);
    t.assert.deepStrictEqual(json[0].title, "Hello, World!");
  });

  await t.test("GET /:id should success return item", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: `/${book.id}`,
    });
    const json = response.json();
    t.assert.deepStrictEqual(response.statusCode, 200);
    t.assert.deepStrictEqual(json[0].title, "Hello, World!");
  });

  await t.test("UPDATE /:id should success return item", async (t) => {
    const response = await app.inject({
      method: "PATCH",
      url: `/${book.id}`,
      payload: {
        title: "Hello again, World!",
      },
    });
    const json = response.json();
    t.assert.deepStrictEqual(response.statusCode, 200);
    t.assert.deepStrictEqual(json[0].title, "Hello again, World!");
  });

  await t.test("DELETE /:id should success delete item", async (t) => {
    const response = await app.inject({
      method: "DELETE",
      url: `/${book.id}`,
    });
    const json = response.json();
    t.assert.deepStrictEqual(response.statusCode, 200);
    t.assert.deepStrictEqual(json.rowCount, 1);
  });
});
