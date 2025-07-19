import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import users from "./model/user.model.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // credentials:true
  })
);

app.use(express.json({ limit: "20kb" }));
// Parses incoming JSON requests and limits the body size to 20kb

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// Parses incoming URL-encoded data (from forms), with nested object support and 16kb limit

app.use(express.static("public"));
// Serves static files (e.g., images, CSS, JS) from the "public" directory

app.use(cookieParser());
// Parses cookies attached to the client request (req.cookies)

//login page
app.post("/login", express.json(), async (req, res) => {
  try {
    // console.log(req.body);
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let data = await users.findOne({ email: req.body.email }).select("email password -_id");

    if (data) {
      if (req.body.password === data.password) {
        res.status(200).json({ message: "Login Successfull" });
      } else {
        res.status(400).json({ message: "Wrong Credentials" });
        return;
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// testing data insert
// app.get("/",async (req , res) =>{
//     let data = await users.create({name:"shubh",email:"samrat@gmail.com",password:"hello",role:"student",roleProfileRef:"StudentProfile"});
//     res.send(data);
// });
export default app;
