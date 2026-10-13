import dotenv from "dotenv";
import https, { Server as HTTPSServer } from "https";
import fs from "node:fs";
import path from "node:path";
import app from "./app";
import connectDB from "./configs/db";
import { initializeSocket } from "./infrastructures/socket/socket.server";
import morgan from "morgan";
import { loggerStream } from "./utils/logger";
import { startCrons } from "./crons";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const certsPath = path.resolve(process.cwd(), "../certs");

const httpsOptions = {
  key: fs.readFileSync(path.join(certsPath, "localhost-key.pem")),
  cert: fs.readFileSync(path.join(certsPath, "localhost.pem")),
};

startCrons();

app.use(
  morgan("combined", {
    stream: loggerStream,
  }),
);

connectDB();

const server: HTTPSServer = https.createServer(httpsOptions, app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`HTTPS server running at https://localhost:${PORT}`);
});
