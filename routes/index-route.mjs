import {Router} from "express";
import authRouter from "./auth-route.mjs";
import userRoute from "./user-route.mjs";

const router = new Router();

router.use("/auth", authRouter);
router.use("/users", userRoute);

export default router;