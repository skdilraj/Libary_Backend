import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import user from "./model/user.model.js";
import authRoutes from "./routes/auth.js";
import connectDB from './db/db.js';
dotenv.config(); // Load .env

const app = express();

connectDB().then(()=>{
    app.listen(PORT,()=>{
    console.log("app is listening to port ",PORT);
    })
}).catch((err)=>{
    console.log("Mongo Db failed connection ",err)
})

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // credentials: true
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Login test route
app.use("/api/auth", authRoutes);

//  Add this to start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
