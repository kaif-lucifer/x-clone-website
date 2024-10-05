import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';

import connectMongoDB from './db/connectMongoDb.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form Data(urlencoded)
app.use(cookieParser()); // to get cookies in req.cookies.jwt


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {

    console.log("Server is Running at http://localhost:5000");
    connectMongoDB();
});