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
    .json(
        new ApiResponse(
            200, user ,
          "user Logged in successfully"  
        )
    )

})

const logout = asyncHandler(async (req, res)=>{
    await  User.findByIdAndUpdate(
        req.user._id, {
            $unset:{
                refreshToken: 1
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
    .json(new ApiResponse(200, {}, "User Logout successfully"))
})


const updateUserDetail = asyncHandler(async(req, res)=>{
    const {username, email} = req.body;
     
    if(!username && !email) {
        throw new ApiError (400, 'At least one field are required')
    }


    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
        $set: {
            email,
            username
        } 
        },{new:true}
    ).select('-password -refreshToken')

    if(!user){
        throw new ApiError(404, 'User count not be updated')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const changePassword = asyncHandler(async (req, res)=>{
    const {oldPassword, newPassword} = req.body;

    if(!oldPassword || !newPassword){
         throw new ApiError(400, 'Both oldPassword and newPassword is required')
    }

    const user = await User.findById(req.user?._id) //req.user is coming from authmiddleware
    if(!user){
        throw new ApiError(404, 'User not found')
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400, 'Invalid oldPaasword ')
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200).
    json(new ApiResponse(200, {} , 'Password changed successfully'))

})

const deleteUser = asyncHandler(async(req, res)=>{
const userId = req.user?._id;

if(!userId){
    throw new ApiError(400, 'User ID not provided')
}
 
const user = await User.findByIdAndDelete(userId);

if (!user) {
    throw new ApiError(404, 'User not found or already deleted');
}

return res
.status(200)
.clearCookie('accessToken')
.json(new ApiResponse(200, null, 'Account deleted successfully'))
})


export {test ,
     signUp ,
      signIn ,
       logout,
       updateUserDetail,
       changePassword,
       deleteUser,
    
    }