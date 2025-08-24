import request from "supertest";
import app from "../app.js";

describe("Packages", () => {
  it("GET /api/packages -> 200 y array", async () => {
    const res = await request(app).get("/api/packages");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
