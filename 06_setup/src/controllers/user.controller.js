import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
// import jwt from "../middlewares/auth.middleware.js"

// this will get user from the model where schema is defined
// this can directly contact mongoose


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        // because we only added one field so we dont want db to validate

        return { accessToken, refreshToken }
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

    console.log(user);


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
    const { username, email, password } = req.body;
    console.log(username, email, password);

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
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id). // you can update also without 
        select("-password -refreshToken")

    console.log("This is the logged in user")
    console.log(loggedInUser)
    // now them to cookies


    const options = {
        httpOnly: true,
        secure: true
    }


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    // remove cookies and also 
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true // you will get new upadted value in return
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))

})

// after this

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshAccessToken

        if (!incomingRefreshToken) {
            throw new ApiError(401, "unauthorized requiest");
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used ")
        }

        const options = {
            httpOnly: true,
            secure: ture
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const passCorrect = user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false }) // because only one field is chagned

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed Successfully"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(200, req.user, "Currect user fetched successfully")
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")

    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email,

            }
        },
        { new: true } // this will reutrn updated value
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))

})

// when there is some chagne in files , 
// It is good to do it in different controller

// const updateUserAvatar = asyncHandler(async(req, res) => {

//     req.files

// })


const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing")
    }

    // aggregation pipeline 
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase() // ? is for better safety
            }
        },
        {
            $lookup: { // adding channel
                from: "subscriptions", // here the name of actual doc will pass
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"

            }
        },
        {
            $lookup: { // adding subs
                from: "subscriptions", // here the name of actual doc will pass
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSbuscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: { // conditional for is subs
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: { // what you want to pass : 1
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSbuscribedToCount: 1,
                isSubscribed: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                createdAt: 1
            }
        }
    ])

    if(!channel?.length) {
        throw new ApiError(404, "channel does not exists");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})

// *** cosole log to see what value does it return array or list ... oor google it

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
}