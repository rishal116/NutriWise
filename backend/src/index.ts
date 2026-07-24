import dotenv from "dotenv";
import http, { Server as HTTPServer } from "http";
import app from "./app";
import connectDB from "./configs/db";
import { initializeSocket } from "./infrastructures/socket/socket.server";
import { startPayoutCron } from "./crons/payout.cron";
import { startPlanExpiryCron } from "./crons/planExpiry.cron";
import { startCoachingLifecycleCron } from "./crons/subscription.cron";
import morgan from "morgan";
import { loggerStream } from "./utils/logger";

app.use(
  morgan("combined", {
    stream: loggerStream,
  }),
);

dotenv.config();
const PORT = process.env.PORT;

startPlanExpiryCron();
connectDB();
startPayoutCron();
startCoachingLifecycleCron();

const server: HTTPServer = http.createServer(app);
initializeSocket(server);
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
