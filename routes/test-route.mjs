import { Router } from 'express';
import TestController from '../controllers/test-controller.mjs';
import authMiddleware from '../middlewares/auth-middleware.mjs';

const router = new Router();

router.use(authMiddleware);

// Получить тесты, где пользователь автор или участник
router.get('/', TestController.getUserRelatedTests);

export default router;
