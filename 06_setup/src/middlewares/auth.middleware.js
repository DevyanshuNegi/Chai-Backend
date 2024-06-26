import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";


export const verifyJWT = asyncHandler(async(req, res, 
    next)=>{
        try {
            const token = req.cookies?.accessToken || req.header 
            ("Authorization")?.replace("Bearer ", "")
            // header is just good for some cases and this is written as "Bearer <token>"
            // taking the token from cookies or header

            if(!token) {
                throw new ApiError(401, "Unauthorized request")
            }         

            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            console.log("decoded token " , decodedToken)

            const user = await User.findById(decodedToken?._id).
            select("-password -refreshToken") // getting token from db
    
            if (!user) {
                throw new ApiError(401, "Invalid Access Token")
            }
            
            req.user = user;
            next()
        } catch (error) {
            // console.log("error on auth middleware")
            throw new ApiError (401, error?.message || "Invalid access token")
        }
    })