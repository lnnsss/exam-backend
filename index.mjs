import express from "express";
import dotenv from "dotenv";
import indexRouter from "./routes/index-route.mjs";
import cors from "cors";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3001", 10);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use('/api', indexRouter);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));