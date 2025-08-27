import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use("/api/v1",songRoutes)

app.listen(port, () => {
  console.log(`Song service is running on port ${port}`);
});
