import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import connectMongoDB from './db/connectMongoDb.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form Data(urlencoded)
app.use(cookieParser()); // to get cookies in req.cookies.jwt


app.use("/api/auth", authRoutes);

app.listen(PORT, () => {

    console.log("Server is Running at http://localhost:5000");
    connectMongoDB();
});