const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users.js");
const guard = require("../../../helpers/guard.js");
const upload = require("../../../helpers/uploadAvatar.js");

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.patch("/", guard, ctrl.updateSubscription);
router.patch("/avatars", guard, upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;
