import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

 const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({ limit: "20kb" })); 
// Parses incoming JSON requests and limits the body size to 20kb

app.use(express.urlencoded({ extended: true, limit: "16kb" })); 
// Parses incoming URL-encoded data (from forms), with nested object support and 16kb limit

app.use(express.static("public")); 
// Serves static files (e.g., images, CSS, JS) from the "public" directory

app.use(cookieParser()); 
// Parses cookies attached to the client request (req.cookies)
export default app;