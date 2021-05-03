const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const Users = require("../service/user.js");

require("dotenv").config();
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: TOKEN_SECRET_KEY,
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);
      if (!user) {
        return done(new Error("User not found"), false);
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);