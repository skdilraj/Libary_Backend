import express from "express"
import connectDB from './db/db.js';
import app from "./app.js";
import dotenv from 'dotenv';
dotenv.config();
const PORT=8000;
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
    console.log("app is listening to port ",PORT);
    })
})
.catch((err)=>{
    console.log("Mongo Db failed connection ",err)
})

// const app=express();
// const PORT=8000;

// app .get('/',async(req,res)=>{
//     res.status(200).json("Your server is running you can proced")
// })
// app.listen(PORT,()=>{
//     console.log("app is listening to port ",PORT);
// })