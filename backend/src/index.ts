import dotenv from "dotenv";
import http from "http";
import app from "./app";
import connectDB from "./configs/db";
import { initSocket } from "./infrastructures/socket/socket.server";
dotenv.config();
const PORT = process.env.PORT
connectDB();
const server = http.createServer(app);
initSocket(server);
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
