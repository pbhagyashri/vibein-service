import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { verifyJWT } from '../middlewares/verifyJWT';

const PostRouter = Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *     - Post
 *     description: Register a new user
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      '400':
 *        description: Invalid status value
 */
PostRouter.get('/posts', verifyJWT, async (_, res) => {
	const postController = new PostController();
	const response = await postController.getPosts();
	res.status(response.status).json(response);
});

export default PostRouter;
