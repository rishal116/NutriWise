import dotenv from "dotenv";
import app from "./app";
import  connectDB  from "./configs/db";
dotenv.config();

const PORT = process.env.PORT

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
