import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// this will get user from the model where schema is defined
// this can directly contact mongoose


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false})
        // because we only added one field so we dont want db to validate

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Wrong while gen access and ref token")
    }
}


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

    // findone or find any can use
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "Username or email  already existed s")
    }

    // these new fields in the response come from the multer middleware
    const avatarLocalPath = req.files?.avatar[0]?.path
    // console.log(req.files)

    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    // ***the above line gives error if the conver image is not sent 
    // because then coverimage[0] will be undefined and cannot have .path
    // code below soves this

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is requiered")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is not uploaded")
    }

    const user = await User.create({
        fullName: fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        // if coveriamge exist then take its url else ""
        email: email,
        password: password,
        username: username.toLowerCase()
    })


    // checking if the user is added 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) // this will remove password and refreshToken

    if (!createdUser) {
        throw new ApiError(500, "Went wrong while reg the user")
    }

    return res.status(200).json(
        new ApiResponse(201, createdUser, "User registered")
    )

})


const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    console.log(username, email , password);

    if (!username && !email) {
        throw new ApiError(401, "Username or emial is required")
    }

    const user = await User.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    // errorit "User" is a mongoose object and 
    // so user defined methods should be applied only on
    // "user" which is what we get from the db response

    const isPasswordValid = await user.isPasswordCorrect(password) // this pass is from frontend
    if (!isPasswordValid) {
        throw new ApiError(401, "Password incorrect")
    }

    // if password also correct then gen access and ref token
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const loggedInUser = User.findById(user._id). // you can update also without 
    select("-password -refreshToken")
    // now them to cookies
 
    
    const options = {
        httpOnly: true,
        secure: true
    }

    // return res
    // .status(200)
    // .cookie("accessToken", accessToken, options)
    // .cookie("refreshToken", refreshToken, options)
    // .json(
    //     new ApiResponse(
    //         200,
    //         {
    //             user: loggedInUser, 
    //             accessToken,
    //             refreshToken
    //         },
    //         "User logged in successfully"
    //     )
    // )
    console.log(" these are access and refresh token");
console.log(accessToken)
console.log(refreshToken)

    // res.cookie("accessToken", accessToken, options);
    // res.cookie("refreshToken", refreshToken, options);

    // return res.status(200).json({
    //     user: loggedInUser,
    //     accessToken,
    //     refreshToken,
    //     message: "User logged in successfully"
    // });

    console.log(req)
    console.log(res)
    
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        (
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})

const logoutUser = asyncHandler(async(req, res) => {
    // remove cookies and also 
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})


export { 
    registerUser,
    loginUser,
    logoutUser
 }


 /*
 get username and password
 find the username in db
 get password from db
 match the password and compare
 if password correct
 generate access and refresh token
 send cookies
 */


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