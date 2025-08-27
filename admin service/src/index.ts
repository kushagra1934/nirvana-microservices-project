import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./route.js";
import cloudinary from "cloudinary";
import redis from "redis";
import cors from "cors"

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

cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name as string,
  api_key: process.env.Cloud_Api_Key as string,
  api_secret: process.env.Cloud_Api_Secret as string,
});

const app = express();
app.use(cors());
app.use(express.json());

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS albums(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

    await sql`
        CREATE TABLE IF NOT EXISTS songs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255),
            audio VARCHAR(255) NOT NULL,
            album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

    console.log("Database Intialized Successfully");
  } catch (error) {
    console.log("Error initDb", error);
  }
}

app.use("/api/v1", adminRoutes);

const port = process.env.PORT || 6000;

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Admin service is running on port ${port}`);
  });
});
