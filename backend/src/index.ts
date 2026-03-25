import dotenv from "dotenv";
import http, { Server as HTTPServer } from "http";
import app from "./app";
import connectDB from "./configs/db";
import { initializeSocket } from "./infrastructures/socket/socket.server";
import { startPayoutCron } from "./crons/payout.cron";
import { startPlanExpiryCron } from "./crons/planExpiry.cron";
import bcrypt from "bcryptjs";

dotenv.config();
const PORT = process.env.PORT;

startPlanExpiryCron();
connectDB();
startPayoutCron();


const server: HTTPServer = http.createServer(app);
initializeSocket(server);
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
