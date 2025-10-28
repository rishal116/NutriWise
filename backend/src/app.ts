import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import adminRoutes from './routes/admin.routes'
import { errorMiddleware } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";

dotenv.config();


const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,
}));
app.use(cookieParser());
app.use(errorMiddleware);
app.use(express.json());
app.use(morgan("dev"));

app.use("/admin", adminRoutes)
app.use('/',userRoutes)

export default app;
