const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const app = require("../app");
const { User } = require("../model/__mocks__/data");
const { HttpCode } = require("../helpers/constants");

require("dotenv").config();

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
const takeToken = (payload, secret) => jwt.sign(payload, secret);
const token = takeToken({ id: User._id }, TOKEN_SECRET_KEY);
User.token = token;

jest.mock("../model/user.js");
jest.mock("cloudinary");

describe("Testing the route api/users/avatar", () => {
  describe("Testing update avatar", () => {
    test("should return 401 status for PATCH: /users/avatar", async (done) => {
      const buffer = await fs.readFile("./test/defImg.png");
      const res = await supertest(app)
        .patch("/api/users/avatars")
        .set("Authorization", `Bearer ${null}`)
        .attach("avatar", buffer, "defImg.png");
      expect(res.status).toEqual(HttpCode.UNAUTHORIZED);
      expect(res.body).toBeDefined();
      expect(res.body.message).toEqual("Unauthorized");
      done();
    });

    test("should return 200 status for PATCH: /users/avatar", async (done) => {
      const buffer = await fs.readFile("./test/defImg.png");
      const res = await supertest(app)
        .patch("/api/users/avatars")
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", buffer, "defImg.png");

      expect(res.status).toEqual(HttpCode.SUCCESS);
      expect(res.body).toBeDefined();
      expect(res.body.data.avatarURL).toEqual("secure_url_cloudinary");
      done();
    });
  });
});
