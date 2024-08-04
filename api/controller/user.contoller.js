 import {asyncHandler} from '../utils/asynchandler.utils.js'
 import {ApiError} from '../utils/ApiError.utils.js'
 import {ApiResponse} from '../utils/ApiResponse.utils.js'
 import { User } from '../models/user.model.js'
 
 
 
 const test = (req, res)=>{
    res.json({
        message: "Hello World"
    })
}

export const generateAccessAndRefreshTokens= async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshtoken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false}) //help to save without password

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token")
    }
}

const signUp= asyncHandler(async (req, res)=>{
    const {email, username, password} = req.body;

    if([username, email, password].some((field)=>field?.trim() === '')
    ){
       throw new ApiError(400, "All field are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username is already exist",[
            {field:"username", message:"username already exists"},
            {field: 'email', message: 'Email already exists'}
        ])
    }

    const user = await User.create({
        username,
        email,
        password
    })
    const createUser = await User.findById(user._id).select('-password -refreshToken')
    
    if(!createUser){
        throw new ApiError(500, "Something went wrong while regestring user")
    }

    return res.status(201).json(
        new ApiResponse(200, createUser, "User registered Successfully")
    )
})


const signIn = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;

    if(!email) {
        throw new ApiError(400, "emaul is required ")
    }

    const user = await User.findOne({email});
     if (!user){
        throw new ApiError(404, "User doesnot exit")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user password")
    }

    const {accessToken, refreshToken}  = await generateAccessAndRefreshTokens(user._id)

    const loggedInInUser = await User.findById(user._id).
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
                user: loggedInInUser, accessToken, refreshToken , user
            },
          "user Logged in successfully"  
        )
    )

})

const logout = asyncHandler(async (req, res)=>{
    await  User.findByIdAndUpdate(
        req.user._id, {
            $set:{
                refreshToken: undefined
            }
        },
        {new:true}
      )
      const options = {
        httpOnly:true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout successfully"))
})


export {test , signUp , signIn , logout}