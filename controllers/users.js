const Service = require("../service/user.js");
const { HttpCode } = require("../helpers/constants.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

const signup = async (req, res, next) => {
  const { email } = req.body;
  const user = await Service.findByEmail(email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "Email is already has in base",
    });
  }
  try {
    const result = await Service.createUser(req.body);
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        id: result.id,
        email: result.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Service.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Bad credentials",
      });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, TOKEN_SECRET_KEY, { expiresIn: "6h" });
    await Service.updateToken(user.id, token);
    return res.status(HttpCode.SUCCESS).json({
      status: "success",
      code: HttpCode.SUCCESS,
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Service.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
};
