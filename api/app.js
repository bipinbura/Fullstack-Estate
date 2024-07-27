import express from "express";



const app = express();

app.use(express.json());


import userRouter from './routes/users.route.js'


app.use("/api/users", userRouter);


export {app}