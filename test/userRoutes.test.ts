import request from "supertest";
import { expect } from "chai";
import app from "../src/index"; // Asegúrate de que la ruta sea correcta

describe("User Routes", () => {
  let token: string;

  before(async () => {
    // Autentica y obtiene un token válido
    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password" });
    token = res.body.token;
  });

  it("GET /account should return user account details", (done) => {
    request(app)
      .get("/account")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("email");
        // Añade más expectativas según sea necesario
        done();
      });
  });

  it("POST /register should create a new user", (done) => {
    request(app)
      .post("/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password",
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("GET / should return a list of users", (done) => {
    request(app)
      .get("/")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  // Añade más pruebas para otras rutas según sea necesario
});
