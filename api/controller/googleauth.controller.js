import {asyncHandler} from '../utils/asynchandler.utils.js'
import {ApiError} from '../utils/ApiError.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'
import { User } from '../models/user.model.js'
import {generateAccessAndRefreshTokens} from './user.contoller.js'

  export const googleAuth = asyncHandler(async (req, res)=>{
  const  {email, username} = req.body;
  
  const existedUser = await User.findOne({email})

   if(existedUser){
    const {accessToken, refreshToken}  = await generateAccessAndRefreshTokens(existedUser._id)

    const loggedInInUser = await User.findById(existedUser._id).
    select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, {
                user: loggedInInUser, accessToken, refreshToken , loggedInInUser
            },
          "user Logged in successfully"  
        )
    )

   } else {
      const generatedPassword = Math.random().toString(36).slice(-8);

      const user = await User.create({
        username: username.split('').join('').toLowerCase(),
        email,
        password: generatedPassword
       })
       const Newuser = await User.findById(user._id).select('-password -refreshToken')


       if(!Newuser){
        throw new ApiError(500, "Something went wrong while regestring user")
       }

     return res.status(201).json(
        new ApiResponse(200, Newuser, "User registered Successfully")
    )
   }

    
})