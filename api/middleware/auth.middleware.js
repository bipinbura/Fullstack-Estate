// it only check if user is Logged In or Not

import { asyncHandler } from "../utils/asynchandler.utils.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.utils.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    //req.cookies helps to access to all types of cookies
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // decode Information from token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next(); //After finishing one task go to another task with all infoemation
  } catch (error) {
    throw new ApiError(401, error?.message || 
        "Invalid access token"
    )
  }
});
