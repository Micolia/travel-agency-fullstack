import request from "supertest";
import app from "../app.js";

describe("Auth", () => {
  it("POST /api/auth/login con credenciales inválidas -> 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "noexiste@example.com",
      password: "bad"
    });
    expect(res.statusCode).toBe(401);
  });
});
