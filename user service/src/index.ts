import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./route.js"

dotenv.config();

const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "Nirvana",
    });
    console.log("Mongo Db Connected");
  } catch (error) {
    console.log(error);
  }
};

const app = express();
app.use(express.json());


app.use("/api/v1",userRoutes);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("User service is running");
});

app.listen(port, () => {
  console.log(`User service is running on port ${port}`);
  connectDb();
});
