import {Router} from "express";
import authRouter from "./auth-route.mjs";

const router = new Router();

router.use("/auth", authRouter);

export default router;