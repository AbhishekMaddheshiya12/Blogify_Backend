import cookieParser from 'cookie-parser';
import express from 'express';
import { dbConnect } from './config/database.js';
import userRouter from './routes/user.js';
import cors from 'cors';
import multer from 'multer';
const upload = multer();
import { cloudConfig } from './config/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

dbConnect();
cloudConfig();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-actual-frontend-url.vercel.app" 
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use("/user", userRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log('Great Going Just Deployed');
});
