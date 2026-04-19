import { Router } from 'express';

import indexController from "../middleware/index.js";


const router = Router()
router.get("/",indexController.homePageGet)

router.get("/sign-up",indexController.signUpGet)
router.post("/sign-up",indexController.signUpPost)

router.get("/log-in",indexController.logInGet)

export default router