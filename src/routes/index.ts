import { Router } from 'express';
import authRouter from './authRoutes';
import postRouter from './postRoutes';

const router = Router();
router.use(authRouter);
router.use(postRouter);

export default router;
