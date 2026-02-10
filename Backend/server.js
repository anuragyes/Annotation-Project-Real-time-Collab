import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import cors from 'cors';
import ConnectMongodB from './Config/Db.js';
import userRouter from './Routers/UserRoute.js';
import DocRouter from './Routers/Doc.router.js';
import Annotationrouter from './Routers/AnnotationRouter.js';
import { initSocket } from './sockets/index.js';
import redisClient, { connectRedis } from "./Config/redis.js";

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());



// Routers
app.use("/api/User", userRouter);
app.use("/api/Document", DocRouter);
app.use("/api/Annotation/pdf", Annotationrouter);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is alive!" });
});

// DB + Redis
ConnectMongodB();
connectRedis();


// Create HTTP server and attach Socket.io
const server = http.createServer(app);
export const io = initSocket(server); // init sockets here

// Listen only once on the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
