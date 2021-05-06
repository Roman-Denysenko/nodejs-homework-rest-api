const Jimp = require("jimp");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const Service = require("../service/user.js");
const { HttpCode, Status } = require("../helpers/constants.js");
const { FONT_SANS_10_BLACK } = require("jimp");

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
        avatarURL: result.avatarURL,
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

const updateSubscription = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { subscription } = req.body;
    if (
      subscription === Status.STARTER ||
      subscription === Status.PRO ||
      subscription === Status.BUSINESS
    ) {
      const result = await Service.updateSubscription(id, subscription);
      return res.json({
        status: "success",
        code: HttpCode.SUCCESS,
        data: {
          subscription: result.subscription,
          id: result.id,
          email: result.email,
        },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Bad request",
    });
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const id = req.user.id;
    const urlAvatar = await saveAvatarUrl(req);

    await Service.updateAvatar(id, urlAvatar);
    return res.json({
      status: "success",
      code: HttpCode.SUCCESS,
      data: { avatarURL: urlAvatar },
    });
  } catch (err) {
    res.json({
      status: "Unauthorized",
      code: HttpCode.UNAUTHORIZED,
      data: {
        message: "Not authorized",
      },
    });
  }
};

const saveAvatarUrl = async (req) => {
  const FOLDER_AVATARS = process.env.FOLDER_AVATARS;
  const pathFile = req.file.path;
  const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const newAvatarName = `${uniquePrefix}-${req.file.originalname}`;
  const avatar = await Jimp.read(pathFile);
  await avatar
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);

  try {
    await fs.rename(
      pathFile,
      path.join(process.cwd(), "public", FOLDER_AVATARS, newAvatarName)
    );
  } catch (err) {
    console.log(err.message);
  }
  const oldAvatar = req.user.avatarURL;
  console.log(path.join(process.cwd(), "public", oldAvatar));
  if (oldAvatar.includes(`${FOLDER_AVATARS}`)) {
    fs.unlink(path.join(process.cwd(), "public", oldAvatar));
  }

  return path.join(FOLDER_AVATARS, newAvatarName);
};

module.exports = {
  signup,
  login,
  logout,
  updateSubscription,
  updateAvatar,
};
