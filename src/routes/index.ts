import { Router } from 'express';
import authRouter from './authRoutes';
import postRouter from './postRoutes';
import AuthorRouter from './authorRoutes';

const router = Router();
router.use(authRouter);
router.use(postRouter);
router.use(AuthorRouter);

export default router;
