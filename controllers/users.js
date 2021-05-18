const Jimp = require("jimp");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");

const Model = require("../model/user.js");
const EmailService = require("../services/email.js");
const { HttpCode, Status } = require("../helpers/constants.js");

require("dotenv").config();
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const loadingOnCloudinary = promisify(cloudinary.uploader.upload);

const signup = async (req, res, next) => {
  const { email } = req.body;
  const user = await Model.findByEmail(email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "Email is already has in base",
    });
  }
  try {
    const result = await Model.createUser(req.body);
    try {
      const emailService = new EmailService(process.env.SENDGRID_API_KEY);
      await emailService.sendVerifyEmail(
        result.verifyToken,
        result.email,
        result.name
      );
    } catch (err) {
      console.log(err);
    }
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
    const user = await Model.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Bad credentials",
      });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, TOKEN_SECRET_KEY, { expiresIn: "6h" });
    await Model.updateToken(user.id, token);
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
    await Model.updateToken(id, null);
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
      const result = await Model.updateSubscription(id, subscription);
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
  if (req.file === undefined) {
    return res.status(HttpCode.BAD_REQUEST).json({
      code: HttpCode.BAD_REQUEST,
      message: "Missing fields",
    });
  }
  try {
    const id = req.user.id;
    // Upload from 'public':
    // const urlAvatar = await saveAvatarUrl(req);
    // await Model.updateAvatar(id, urlAvatar);

    // Upload from Cloudinari:
    const resultUrl = await saveAvatarUserToCloud(req);
    const { public_id: idAvatarFromCloud, secure_url: urlAvatar } = resultUrl;
    await Model.updateAvatar(id, urlAvatar, idAvatarFromCloud);

    return res.json({
      status: "Success",
      code: HttpCode.SUCCESS,
      data: { avatarURL: urlAvatar },
    });
  } catch (err) {
    res.status(HttpCode.UNAUTHORIZED).json({
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

const saveAvatarUserToCloud = async (req) => {
  const pathFile = req.file.path;
  const result = await loadingOnCloudinary(pathFile, {
    public_id: req.user.idAvatarFromCloud?.replace("Avatars/", ""),
    folder: "Avatars",
    transformation: { width: 250, height: 250, crop: "pad" },
  });
  await fs.unlink(pathFile);
  return result;
};

const verificationToken = async (req, res, next) => {
  try {
    const user = await Model.findByVerifyToken(req.params.verificationToken);
    if (user) {
      await Model.updateVerifyToken(user, true, null);
      return res.status(HttpCode.SUCCESS).json({
        status: "OK",
        code: HttpCode.SUCCESS,
        ResponseBody: {
          message: "Verification successful",
        },
      });
    }
    res.status(HttpCode.NOT_FOUND).json({
      status: "Not found",
      code: HttpCode.NOT_FOUND,
      ResponseBody: {
        message: "User not found",
      },
    });
  } catch (err) {
    next(err);
  }
};

const repeatEmailVerify = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Missing required field email",
    });
  }
  try {
    const user = await Model.findByEmail(email);
    if (user && !user.verify) {
      const emailService = new EmailService(process.env.SENDGRID_API_KEY);
      await emailService.sendVerifyEmail(
        user.verifyTokenEmail,
        user.email,
        user.name
      );
      return res.status(HttpCode.SUCCESS).json({
        status: "success",
        code: HttpCode.SUCCESS,
        data: { message: "Verification email resubmitted" },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "bad request",
      code: HttpCode.BAD_REQUEST,
      data: { message: "Verification has already been passed" },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  updateSubscription,
  updateAvatar,
  verificationToken,
  repeatEmailVerify,
};
