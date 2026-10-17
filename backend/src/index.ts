import dotenv from "dotenv";
import http, { Server as HTTPServer } from "node:http";
import app from "./app";
import connectDB from "./configs/db";
import { initializeSocket } from "./infrastructures/socket/socket.server";
import morgan from "morgan";
import { loggerStream } from "./utils/logger";
import { startCrons } from "./crons";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

startCrons();

app.use(
  morgan("combined", {
    stream: loggerStream,
  }),
);

connectDB();

const server: HTTPServer = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`HTTP server running at http://localhost:${PORT}`);
});
