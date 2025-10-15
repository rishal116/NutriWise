import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import adminRoutes from './routes/admin.routes'

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], 
}));


app.use(express.json());
app.use(morgan("dev"));

app.use("/admin", adminRoutes)

export default app;
