import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/regiseter").post(registerUser) 
// register method is called

export default router
 