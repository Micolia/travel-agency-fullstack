import request from "supertest";
import app from "../app.js";

describe("Users", () => {
  let token;

  beforeAll(async () => {
    // crea usuario de prueba (registro público)
    await request(app).post("/api/users").send({
      email: "test@example.com",
      password: "123456",
      name: "Tester"
    });

    // login para obtener token
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "123456"
    });
    token = res.body.token;
  });

  it("GET /api/users (protegido) -> 200", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/users sin token -> 401", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(401);
  });
});
