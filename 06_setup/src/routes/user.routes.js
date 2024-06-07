import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, getUserChannelProfile, getWatchHistory  } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post( // MW, mainFunction

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
// http://localhost:8000/api/v1/users

// secured routes

router.route("/logout").post(verifyJWT,// this mw will run first and you can add more middlewares , , then fun
    // then the next function inside will run next fun.
    logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT,updateAccountDetails);
// router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
// router.route("/cover-image").
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)// for getting info from params
router.route("/history").get(verifyJWT, getWatchHistory);


export default router