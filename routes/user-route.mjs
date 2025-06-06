import {Router} from "express";
import UserController from "../controllers/user-controller.mjs";
import authMiddleware from "../middlewares/auth-middleware.mjs";

const router = new Router();

router.use(authMiddleware);

// Получение всех пользователей
router.get('/', UserController.getAllUsers);

// Получение пользователя
router.get('/:id', UserController.getUser);

// Редактирование пользователя
router.put('/:id', UserController.editUser);

// Удаление пользователя
router.delete('/:id', UserController.removeUser);

export default router;