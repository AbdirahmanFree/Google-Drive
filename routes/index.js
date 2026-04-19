const router = require('express').Router();
const indexController = require('../middleware');
// const passport = require('../auth/passport.js');

router.get("/",indexController.homePageGet)

router.get("/sign-up",indexController.signUpGet)
router.post("/sign-up",indexController.signUpPost)

router.get("/log-in",indexController.logInGet)

module.exports = router