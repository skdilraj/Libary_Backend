import express from "express"
const app=express();
const PORT=8000;

app .get('/',async(req,res)=>{
    res.status(200).json("Your server is running you can proced")
})
app.listen(PORT,()=>{
    console.log("app is listening to port ",PORT);
})