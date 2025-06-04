import express from "express";
import dotenv from "dotenv";
import indexRouter from "./routes/index-route.mjs";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3001", 10);

const app = express();

app.use(express.json());
app.use('/api', indexRouter);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));