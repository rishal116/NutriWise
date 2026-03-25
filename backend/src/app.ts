import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import nutriRoutes from "./routes/nutritionist.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import chatRoutes from "./routes/chat.routes"
import sessionRoutes from "./routes/session.routes"


dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(
  "/stripe/webhook",
  express.raw({ type: "application/json" })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required in production");
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI!,
      collectionName: "sessions",
      ttl: 60 * 60 * 24,
    }),
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

app.use("/admin", adminRoutes);
app.use("/", userRoutes);
app.use("/chat", chatRoutes);
app.use("/nutritionist", nutriRoutes);
app.use("/session", sessionRoutes);

app.use(errorMiddleware);

export default app;