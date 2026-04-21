import { Router } from 'express';

import indexController from "../middleware/index.js";
import passport from '../auth/passport.js';


const router = Router()
router.get("/",indexController.homePageGet)

router.get("/sign-up",indexController.signUpGet)
router.post("/sign-up",indexController.signUpPost)

router.get("/log-in",indexController.logInGet)
router.post("/log-in",passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/log-in"
}))

export default router