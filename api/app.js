import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser()) //cookie are two way access


//imports routes
import userRouter from './routes/users.route.js'
import googleRouter from './routes/googleauth.routes.js'
import ListingRouter from './routes/Listing.route.js'

//use route
app.use("/api/users", userRouter);
app.use("/api/auth", googleRouter)
app.use("/api/list", ListingRouter)


export {app}