import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"

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


    res.status(200).json({
        message: "OK"
    })
})

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