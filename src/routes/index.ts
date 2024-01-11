import { Router } from 'express';
import authRouter from './authRoutes';
import postRouter from './postRoutes';
import UserRouter from './userRoutes';

const router = Router();
router.use(authRouter);
router.use(postRouter);
router.use(UserRouter);

export default router;
