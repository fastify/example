const tap = require("tap");
const fastify = require("./server");

tap.test("should test all API endpoint", async (t) => {
  const mockServer = t.mock("./server", {
    "./query": {
      migration: () => true,
      create: () => {
        throw new Error();
      },
      getById: () => {
        throw new Error();
      },
      deleteById: () => {
        throw new Error();
      },
      updateById: () => {
        throw new Error();
      },
      getAll: () => {
        throw new Error();
      },
    },
  });

  let book = {};

  const app = await fastify();
  const mockedApp = await mockServer();
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
    // asign created to use as compare value
    book = json[0];
  });

  t.test("POST / should throw error", async (t) => {
    const response = await mockedApp.inject({
      method: "POST",
      url: "/",
      payload: {
        title: "Hello,World!",
      },
    });
    t.equal(response.statusCode, 500);
  });

  t.test("GET / should success return items", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });
    t.equal(response.statusCode, 200);
    t.equal(response.json().length > 0, true);
  });

  t.test("GET / should throw error", async (t) => {
    const response = await mockedApp.inject({
      method: "GET",
      url: "/",
    });
    t.equal(response.statusCode, 500);
  });

  t.test("GET /:id should success return item", async (t) => {
    const response = await app.inject({
      method: "GET",
      url: `/${book.id}`,
    });
    t.equal(response.statusCode, 200);
    t.equal(response.json()[0].title, "Hello, World!");
  });

  t.test("GET /:id should throw error", async (t) => {
    const response = await mockedApp.inject({
      method: "GET",
      url: `${book.id}`,
    });
    t.equal(response.statusCode, 500);
    t.equal(response.json().message, "internal server error");
  });

  t.test("UPDATE /:id should success return item", async (t) => {
    const response = await app.inject({
      method: "PATCH",
      url: `/${book.id}`,
      payload: {
        title: "Hello again, World!",
      },
    });
    t.equal(response.statusCode, 200);
    t.equal(response.json()[0].title, "Hello again, World!");
  });

  t.test("UPDATE /:id should throw error", async (t) => {
    const response = await mockedApp.inject({
      method: "PATCH",
      url: `${book.id}`,
      payload: {
        title: "Hello again, World!",
      },
    });
    t.equal(response.statusCode, 500);
    t.equal(response.json().message, "internal server error");
  });

  t.test("DELETE /:id should success delete item", async (t) => {
    const response = await app.inject({
      method: "DELETE",
      url: `/${book.id}`,
    });
    t.equal(response.statusCode, 200);
  });

  t.test("DELETE /:id should throw error", async (t) => {
    const response = await mockedApp.inject({
      method: "DELETE",
      url: `${book.id}`,
    });
    t.equal(response.statusCode, 500);
    // call app close on last test child to close app and db properly
    app.close();
    mockedApp.close();
  });
});
