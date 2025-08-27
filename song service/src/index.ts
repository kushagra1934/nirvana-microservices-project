import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";
import redis from "redis";
import cors from "cors";

dotenv.config();

export const redisClient = redis.createClient({
  password: process.env.Redis_Password as string,
  socket: {
    host: "redis-18187.c84.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 18187,
  },
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
  });

const app = express();
const port = process.env.PORT || 7000;
app.use(cors());

app.use(express.json());
app.use("/api/v1", songRoutes);

app.listen(port, () => {
  console.log(`Song service is running on port ${port}`);
});
