import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import authRoutes from "./routes/authroutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from './routes/userRoutes.js';

import connectToMongoDB from "./db/connectToMongoDB.js";


const app = express();

const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); // to parse the incoming JSON

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`server listening on http://localhost:${PORT}`);
});
