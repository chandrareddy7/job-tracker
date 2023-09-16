import "express-async-errors";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import authRouter from "./routes/authRouter.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hell");
});

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "This is valid" });
});

app.post("/api/v1", (req, res) => {
  res.send({ message: "got data successfully", data: req.body });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
