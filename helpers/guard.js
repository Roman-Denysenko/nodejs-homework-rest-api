const passport = require("passport");
const { HttpCode } = require("./constants");
require("../config/passport");

const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const [, token] = req.get("Authorization")?.split(" ");
    if (!user || err || token !== user.token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Unauthorized",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
