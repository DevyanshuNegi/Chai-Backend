import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(

    upload.fields([ // accepts array
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)
// router.route("/register").post(registerUser) 

// register method is called
// this is ther route that will be added after 
// http://localhost:8000/api/v1/user


// secret routes
router.route("/logout").post(verifyJWT,// this mw will run first and
    // then the next function inside will run next fun.
    logoutUser)

export default router