import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser()) //cookie are two way access


//imports routes
import userRouter from './routes/users.route.js'


//use route
app.use("/api/users", userRouter);


export {app}