import {Router} from "express";
import authRouter from "./auth-route.mjs";
import userRoute from "./user-route.mjs";
import testRoute from "./test-route.mjs";

const router = new Router();

router.use("/auth", authRouter);
router.use("/users", userRoute);
router.use("/tests", testRoute);

export default router;