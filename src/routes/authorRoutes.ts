import { Response, Request } from 'express';
import { authenticateUser } from '../middlewares/authenticateUser';
import { AuthorController } from '../controllers/author-controller';
import { Router } from 'express';
import { authorizeUser } from '../middlewares/authorizeUser';
import { TypedRequestBody } from '@/types';

const AuthorRouter = Router();

/**
 * @swagger
 * /authors/{authorId}/posts:
 *   get:
 *     tags:
 *     - Author
 *     description: Get users posts
 *     parameters:
 *     - in: path
 *       name: authorId
 *       schema:
 *         type: string
 *         required: true
 *         default: df1095d1-99d1-481d-855c-d15efd5030c7
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
AuthorRouter.get('/authors/:authorId/posts', authenticateUser, authorizeUser, async (req: Request, res: Response) => {
	const { authorId } = req.params;
	const authorController = new AuthorController();

	const response = await authorController.geAuthorPosts(authorId);
	return res.status(response?.status || 0).json(response);
});

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}:
 *   get:
 *     tags:
 *     - Author
 *     description: Get Authors Posts
 *     parameters:
 *     - in: path
 *       name: authorId
 *       schema:
 *         type: string
 *         required: true
 *         default: df1095d1-99d1-481d-855c-d15efd5030c7
 *     - in: path
 *       name: postId
 *       schema:
 *         type: string
 *         required: true
 *         default: 19c298f0-64ad-405e-bd11-fe14a8122ead
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
AuthorRouter.get('/users', async (_, res: Response) => {
	const authorController = new AuthorController();
	const response = await authorController.getUsers();
	return res.status(response.status).json(response);
});

AuthorRouter.get(
	'/authors/:authorId/posts/:postId',
	authenticateUser,
	authorizeUser,
	async (req: Request, res: Response) => {
		const { authorId, postId } = req.params;

		const authorController = new AuthorController();
		const response = await authorController.getUserPostById({ authorId, postId });

		return res.json(response);
	},
);

/**
 * @swagger
 * /authors/{authorId}/posts:
 *   post:
 *     tags:
 *     - Author
 *     description: Create a new post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: authorId
 *       schema:
 *         type: string
 *         required: true
 *         default: df1095d1-99d1-481d-855c-d15efd5030c7
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
AuthorRouter.post(
	'/authors/:authorId/posts',
	authenticateUser,
	authorizeUser,
	async (req: TypedRequestBody<{ title: string; content: string }>, res: Response) => {
		const { authorId } = req.params;
		const { title, content } = req.body;

		const authorController = new AuthorController();
		const response = await authorController.createPost({ title, content, authorId });

		return res.status(response.status).json(response);
	},
);

/**
 * @swagger
 * /me:
 *   get:
 *     tags:
 *     - Author
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
AuthorRouter.get('/me', authenticateUser, async (req: Request, res: Response) => {
	const token = req.headers.authorization?.split(' ')[1];

	const authorController = new AuthorController();
	const response = await authorController.me(token);

	return res.status(response.status).json(response);
});

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}:
 *   patch:
 *     tags:
 *     - Author
 *     description: Update post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: authorId
 *       schema:
 *         type: string
 *         required: true
 *         default: df1095d1-99d1-481d-855c-d15efd5030c7
 *     - in: path
 *       name: postId
 *       schema:
 *         type: string
 *         required: true
 *         default: 03349883-fd7a-4197-8ae5-3b48a17fa2d5
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
AuthorRouter.patch(
	'/authors/:authorId/posts/:postId',
	authenticateUser,
	authorizeUser,
	async (req: Request, res: Response) => {
		const { body } = req;
		const { authorId, postId } = req.params;

		const authorController = new AuthorController();
		const response = await authorController.updatePost({ authorId, postId, postParam: body });

		return res.status(response.status).json(response);
	},
);

/**
 * @swagger
 * /authors/{authorId}/posts/{postId}:
 *   delete:
 *     tags:
 *     - Author
 *     description: Delete post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: authorId
 *       schema:
 *         type: string
 *         required: true
 *         default: df1095d1-99d1-481d-855c-d15efd5030c7
 *     - in: path
 *       name: postId
 *       schema:
 *         type: string
 *         required: true
 *         default: 04552f31-4855-46b5-9b07-58f298bfda02
 *     responses:
 *      '200':
 *        description: 'Post deleted successfully'
 *      '400':
 *        description: Could not get posts
 */
AuthorRouter.delete(
	'/authors/:authorId/posts/:postId',
	authenticateUser,
	authorizeUser,
	async (req: Request, res: Response) => {
		const { authorId, postId } = req.params;

		const authorController = new AuthorController();
		const response = await authorController.deletePost(authorId, postId);
		res.status(200).json(response);
	},
);

export default AuthorRouter;
