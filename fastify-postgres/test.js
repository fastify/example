"use strict";

const tap = require("tap");
const fastify = require("./server");

tap.test("should test all API endpoint", async (t) => {
  let book = {};

  const app = await fastify();

  t.teardown(() => app.close());
  // only to test error path
  t.test("POST / should success create item", async (t) => {
    const response = await app.inject({
      method: "POST",
      url: "/",
      payload: {
        title: "Hello, World!",
      },
    });
    const json = response.json();
    t.equal(response.statusCode, 200);
    t.equal(json[0].title, "Hello, World!");
    // assign created to use as compare value
    book = json[0];
  });

  t.test("GET / should success return items", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });
    const json = response.json();
    t.equal(response.statusCode, 200);
    t.equal(json.length > 0, true);
    t.equal(json[0].title, "Hello, World!");
  });

  t.test("GET /:id should success return item", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: `/${book.id}`,
    });
    const json = response.json();
    t.equal(response.statusCode, 200);
    t.equal(json[0].title, "Hello, World!");
  });

  t.test("UPDATE /:id should success return item", async (t) => {
    const response = await app.inject({
      method: "PATCH",
      url: `/${book.id}`,
      payload: {
        title: "Hello again, World!",
      },
    });
    const json = response.json();
    t.equal(response.statusCode, 200);
    t.equal(json[0].title, "Hello again, World!");
  });

  t.test("DELETE /:id should success delete item", async (t) => {
    const response = await app.inject({
      method: "DELETE",
      url: `/${book.id}`,
    });
    const json = response.json();
    t.equal(response.statusCode, 200);
    t.equal(json.rowCount, 1);
  });
});
