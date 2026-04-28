import { Router } from 'express';
import indexController from "../middleware/index.js";
import passport from '../auth/passport.js';
import multer, { memoryStorage } from 'multer';
const upload = multer({storage:memoryStorage() })


const router = Router()
router.get("/",indexController.homePageGet)

router.get("/my-drive",indexController.isAuthenticated,indexController.myDriveGet)


router.get("/sign-up",indexController.signUpGet)
router.post("/sign-up",indexController.signUpPost)

router.get("/log-in",indexController.logInGet)
router.post("/log-in",passport.authenticate('local', {
    successRedirect: "/my-drive",
    failureRedirect: "/log-in"
}))

router.post("/add-file", upload.single('file'),indexController.addFilePost)

router.post("/log-out",indexController.logOutPost)
export default router