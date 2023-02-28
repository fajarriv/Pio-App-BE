import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { register,verifyToken } from "./controllers/auth.js";
import { updateProfile } from "./controllers/users.js";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.disable('etag');

// Mongoose
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log("Connected"));
  })
  .catch((error) => console.log(`${error} did not connect`));

// Middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
app.use(express.json());
// app.use(express.json({ limit: "30mb", extended: true }));
// app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/images", express.static(path.join(__dirname, "public/images")));
// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
// Register and update profile route
app.post("/auth/register", upload.single("profilePicture"), register);
// Update profile
app.patch("/user/:id/update", upload.single("profilePicture"),verifyToken, updateProfile);

// Routing
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);