import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

import user from "./model/user.model.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import librarianRoutes from "./routes/librarian.js";
import studentRoutes from "./routes/student.js";
import connectDB from './db/db.js';

dotenv.config();

const app = express();

// Allow frontend origin and cookies
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);

// Sessions setup
app.use(
  session({
    name: "lib_session",
    secret: process.env.SESSION_SECRET || "mysessionsecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: "lax", // for CSRF protection
      secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
    }
  })
);
// DEBUG: Log session data
app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);         // login/logout
app.use("/api/admin", adminRoutes);       // admin protected
app.use("/api/librarian", librarianRoutes);
app.use("/api/student", studentRoutes);



// Start the server
const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error(" Failed to connect DB:", err);
});
