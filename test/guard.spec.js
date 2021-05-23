const guard = require("../helpers/guard.js");
const { HttpCode } = require("../helpers/constants.js");
const { User } = require("../model/__mocks__/data");
const passport = require("passport");

describe("Unit test:guard", () => {
  const req = {
    get: jest.fn((header) => `Bearer ${User.token}`),
    user: User,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((response) => response),
  };

  const next = jest.fn();

  test("run guard with not token", () => {
    passport.authenticate = jest.fn(
      (authType, options, callback) => (req, res, next) => {
        callback(null, { token: null });
      }
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Unauthorized",
    });
  });

  test("run guard with token not valid", () => {
    passport.authenticate = jest.fn(
      (authType, options, callback) => (req, res, next) => {
        callback(null, { token: !User.token });
      }
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Unauthorized",
    });
  });

  test("run guard with token valid", () => {
    passport.authenticate = jest.fn(
      (authType, options, callback) => (req, res, next) => {
        callback(null, User);
      }
    );
    guard(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
