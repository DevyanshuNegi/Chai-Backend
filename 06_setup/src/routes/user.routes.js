import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser) 
// register method is called
// this is ther route that will be added after 
// http://localhost:8000/api/v1/user

export default router
 