import express from "express";


const app = express();

app.use(express.json());


//imports routes
import userRouter from './routes/users.route.js'


//use route
app.use("/api/users", userRouter);


export {app}