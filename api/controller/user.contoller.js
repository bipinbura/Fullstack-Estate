 import {asyncHandler} from '../utils/asynchandler.utils.js'
 import {ApiError} from '../utils/ApiError.utils.js'
 import {ApiResponse} from '../utils/ApiResponse.utils.js'
 import { User } from '../models/user.model.js'
 
 
 
 const test = (req, res)=>{
    res.json({
        message: "Hello World"
    })
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
        throw new ApiError(409, "User with email or username is already exist")
    }

    const user = await User.create({
        username,
        email,
        password
    })
    const createUser = await User.findById(user._id).select('-password')
    
    if(!createUser){
        throw new ApiError(500, "Something went wrong while regestring user")
    }

    return res.status(201).json(
        new ApiResponse(200, createUser, "User registered Successfully")
    )
})


export {test , signUp}