import express from 'express';
import cors from 'cors';
import cookieParser  from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
// console.log("cloud name", process.env.CLOUDINARY_CLOUD_NAME);


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public"))
app.use(cookieParser())


// Routes
import userRouter from './routes/user.routes.js';


//routes declaration
app.use("/api/v1/users", userRouter)
// http://localhost:5000/api/v1/users/register


export default app;


