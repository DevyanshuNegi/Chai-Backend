import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
// import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

// this will get user from the model where schema is defined
// this can directly contact mongoose

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body;
    console.log(username, fullName, email, password);

    /*
    if(fullName === "") {
        throw new ApiError(400, "fullName is required")
    }
    else if ...
    */

    // same logic checking if any empty
    if ([fullName, email, username, password].some((field) =>
        field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    return res.status(200).json (
        new ApiResponse(201,createdUser, "User registered")
    )
})
/*
    // findone or find any can use
    const existedUser = User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "Username or email  already existed")
    }

    // these new fields in the response come from the multer middleware
    const avatarLocalPath= req.files?.avatar[0]?.path
    console.log(req.files)

    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is requiered")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new ApiError(400, "Avatar file is not uploaded")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url ||"" ,
        // if coveriamge exist then take its url else ""
        email,
        password,
        username: username.toLowerCase()
    })

    // checking if the user is added 
    const createdUser = await User.findById(user.__id).select(
        "-password -refreshToken"
    ) // this will remove password and refreshToken

    if (!createdUser) {
        throw new ApiError(500, "Went wrong while reg the user")
    }

    return res.status(200).json (
        new ApiResponse(201,createdUser, "User registered")
    )

})*/

export { registerUser }

/*
get info 
validation = not empty
check if already exist: username and email
check for images then upload to cloudinary
take response form cloudinary
create user object - create entry in db
remove password ad refresh token field from resopnse

push to db
check if created
send response
 */