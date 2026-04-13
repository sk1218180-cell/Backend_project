import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse }  from "../utils/ApiResponse.js";

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


export { registerUser }



// get user details from frontend
// validation - not empty
// check if user already exists: username and  email
// check for image and avatar
// upload image to cloudinary, avatar
// create user object and create entry in database
// remove password and refresh token from response
//  check for user creation and 
// return response with user details and success message
