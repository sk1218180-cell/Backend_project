import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse }  from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

         user.refreshToken = refreshToken
         await user.save({validateBeforeSave: false})

         return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
   

const {fullName, email, username, password} = req.body
console.log("email: ", email);

if (
    [fullName, email, username, password].some((field) => 
        field?.trim() === "")
) {
    throw new ApiError(400, "All fields are required")
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format")
}
if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long") 
    // You can add more password complexity checks here if needed
}

 const existedUser = await User.findOne({
    $or: [{ username }, { email }]
})

if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
}

const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImagePath = req.files?.coverImage[0]?.path;
// console.log("avatar path", req.files?.avatar?.[0]?.path);

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) 
&& req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
}

if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
}
console.log("Avatar local path", avatarLocalPath);
console.log("files", req.files);

 const avatar = await uploadOnCloudinary(avatarLocalPath)
 

 if (!avatar) {
    throw new ApiError(400, "avatar file upload failed")
 }

 let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }

 const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password
 })

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createUser) {
      throw new ApiError(500, "Something went wrong while creating user")
  }

return res.status(201).json(
    new ApiResponse(200, createUser, "User registered successfully")
)

})


const loginUser = asyncHandler(async (req, res) => {
      const {email, username, password} = req.body

      if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
      }
       // Here is an alternative to find user by email or username
       // if (!(email || username)) {
       //     throw new ApiError(400, "Username or email is required")
       // }
        const user = await User.findOne({
            $or: [{email}, {username}]
        })

        if (!user) {
            throw new ApiError(404, "User not found!!")
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password")
        }


        const {accessToken, refreshToken} = await
        generateAccessAndRefreshTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

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
                "User logged in successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
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
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async(req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     const user = await User.findById(decodedToken?._id)
 
     if (!user) {
         throw new ApiError(401, "Invalid refresh token")
     }
 
     if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401, "Refresh token is expired")
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
      const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
 
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshtoken", newRefreshToken, options)
      .json(
         new ApiResponse(
             200,
             {accessToken, refreshToken: newRefreshToken},
             "Access token refreshed successfully"
         )
      )
   } catch (error) {
    throw new ApiError(401, error?.message || 
        "Invialid refresh token")
   }

})



export { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
 }


// FOR USER REGISTRATION
// get user details from frontend
// validation - not empty
// check if user already exists: username and  email
// check for image and avatar
// upload image to cloudinary, avatar
// create user object and create entry in database
// remove password and refresh token from response
//  check for user creation and 
// return response with user details and success message
   


// FOR USER LOGIN
// req body - data
// username or email and password
// find user in database with email or username
// password comparison
// access token and refresh token generation
// send cookie 