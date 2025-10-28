"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./configs/db"));
dotenv_1.default.config();
const PORT = process.env.PORT;
(0, db_1.default)();
app_1.default.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
