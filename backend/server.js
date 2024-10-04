import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import connectMongoDB from './db/connectMongoDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// console.log(process.env.MONGO_URI);

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {

    console.log("Server is Running at http://localhost:8000");
    connectMongoDB();
});