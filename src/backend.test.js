process.env.NODE_ENV = "test";
const backend = require('./backend')
const request = require("supertest");
const db = require("./db");

describe("GET / ", () => {
  test("Index should respond with something", async () => {
    const response = await request(backend).get("/");
    expect(response.body).toBeDefined();
    expect(response.statusCode).toBe(200);
  });
});