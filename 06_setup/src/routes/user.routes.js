import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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

// router.route("/register").post(registerUser) 

// register method is called
// this is ther route that will be added after 
// http://localhost:8000/api/v1/user

export default router