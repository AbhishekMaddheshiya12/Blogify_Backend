import cookieParser from 'cookie-parser';
import express from 'express';
import { dbConnect } from './config/database.js';
import userRouter from './routes/user.js';
import cors from 'cors';
import multer from 'multer';
import { cloudConfig } from './config/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer();

dbConnect();
cloudConfig();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "blogify-frontend-p4bq.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/user", userRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running on port 4000");
});
