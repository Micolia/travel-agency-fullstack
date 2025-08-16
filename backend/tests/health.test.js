import request from "supertest";
import app from "../app.js";

describe("Healthcheck", () => {
  it("GET /api/health -> 200", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
