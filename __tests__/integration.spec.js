const request = require("supertest");

const app = require("../src/app");

describe("Integration tests", () => {
  it("Test ping endpoint and gets 200", done => {
    request(app)
      .get("/api/v1/ping")
      .expect(200, done);
  });
});
