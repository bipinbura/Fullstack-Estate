import { app } from './app.js';
import connectDB from './DB/index.js';
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})



connectDB()
.then(()=>{
    app.listen(5000,()=>{
        console.log('server is running on port 5000')
    })
})
.catch((error)=>{
    console.log("Mongo db connection failed")
})

