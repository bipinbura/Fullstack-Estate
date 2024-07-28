import {ApiError} from "./ApiError.utils.js"
import {ApiResponse} from "./ApiResponse.utils.js"


// const asyncHandler = (requestHandler) => {
//     return (req, res, next)=>{
//         Promise.resolve(requestHandler(req, res, next)).catch((error)=> next(error))
//     }
// }

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => {
            
            if (error instanceof ApiError) {
                const { statusCode, message, errors } = error;
                res.status(statusCode).json(new ApiResponse(statusCode, { errors }, message));
            } else {
                next(error);
            }
        });
    };
};

export { asyncHandler };





