import { Response } from 'express';
import { authenticateUser } from '../middlewares/authenticateUser';
import { UserController } from '../controllers/user-controller';
import { Router } from 'express';
import { authorizeUser } from '../middlewares/authorizeUser';
import { TypedRequestBody } from '@/types';

const UserRouter = Router();

/**
 * @swagger
 * /users/{id}/posts:
 *   get:
 *     tags:
 *     - User
 *     description: Get users posts
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *         required: true
 *         default: b8e61310-69d6-4c7a-a6de-003f725463dc
 *     security:
 *       - bearerAuth: []
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Posts'
 *      '400':
 *        description: Could not get users
 */
UserRouter.get('/users/:id/posts', authenticateUser, authorizeUser, async (req: any, res: Response) => {
	const { id } = req.params;

	const userController = new UserController();

	const response = await userController.getUserPosts(id);
	return res.status(response.status).json(response);
});

UserRouter.get('/users', async (_, res: Response) => {
	const userController = new UserController();
	const response = await userController.getUsers();

	return res.status(response.status).json(response);
});

/**
 * @swagger
 * /users/{id}/posts:
 *   post:
 *     tags:
 *     - User
 *     description: Create a new post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *         required: true
 *         default: b8e61310-69d6-4c7a-a6de-003f725463dc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 default: New Post
 *               content:
 *                 type: string
 *                 default: This is a new post
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      '400':
 *        description: Could not get posts
 */
UserRouter.post(
	'/users/:id/posts',
	authenticateUser,
	authorizeUser,
	async (req: TypedRequestBody<{ title: string; content: string }>, res: Response) => {
		const { id } = req.params;
		const { title, content } = req.body;

		const userController = new UserController();
		const response = await userController.createPost({ title, content, authorId: id });

		return res.status(response.status).json(response);
	},
);

/**
 * @swagger
 * /me:
 *   get:
 *     tags:
 *     - User
 *     description: Get current logged in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      '400':
 *        description: Could not get users
 */
UserRouter.get('/me', authenticateUser, async (req: any, res: Response) => {
	const token = req.headers.authorization?.split(' ')[1];

	const userController = new UserController();
	const response = await userController.me(token);

	return res.status(response.status).json(response);
});

/**
 * @swagger
 * /users/{id}/posts/{postId}:
 *   patch:
 *     tags:
 *     - User
 *     description: Update post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *         required: true
 *         default: 5c881810-926b-4438-b3c6-180fbea5f546
 *     - in: path
 *       name: postId
 *       schema:
 *         type: string
 *         required: true
 *         default: 19c298f0-64ad-405e-bd11-fe14a8122ead
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 default: Update Title Again
 *               content:
 *                 type: string
 *                 default: Update Content Again
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      '400':
 *        description: Could not get posts
 */
UserRouter.patch('/users/:id/posts/:postId', authenticateUser, authorizeUser, async (req: any, res: Response) => {
	const { body } = req;
	const { id, postId } = req.params;

	const userController = new UserController();
	const response = await userController.updatePost({ authorId: id, postId, postParam: body });

	return res.status(response.status).json(response);
});

export default UserRouter;
