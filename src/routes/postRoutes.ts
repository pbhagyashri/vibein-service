import { Router, Response, Request } from 'express';
import { PostController } from '../controllers/postController';
import { authenticateUser } from '../middlewares/authenticateUser';
import { TypedRequestBody } from '@/types';

const PostRouter = Router();

/**
 * @swagger
 * /posts?limit={limit}:
 *   get:
 *     tags:
 *     - Post
 *     description: Get all posts
 *     parameters:
 *     - name: limit
 *       in: query
 *       description: 'description regarding limit'
 *       required: true
 *       type: string
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Posts'
 *      '400':
 *        description: Could not get posts
 */
/**
 * @swagger
 * /posts?cursor={cursor}&limit={limit}:
 *   get:
 *     tags:
 *     - Post
 *     description: Get all posts
 *     parameters:
 *     - name: limit
 *       in: query
 *       description: 'description regarding limit'
 *       required: true
 *       type: string
 *     - name: cursor
 *       in: query
 *       description: 'description regarding limit'
 *       required: false
 *       type: string
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Posts'
 *      '400':
 *        description: Could not get posts
 */
PostRouter.get('/posts', async (req: Request, res: Response) => {
	const { limit, cursor } = req.query;
	console.log({ limit, cursor });
	const postController = new PostController();
	const response = await postController.getPosts(parseInt(limit as string), cursor as string);

	res.status(response.status).json(response);
});

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *     - Post
 *     description: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *                 default: New Post
 *               content:
 *                 type: string
 *                 default: This is a new post
 *               authorId:
 *                 type: string
 *                 default: 79856e58-eaa8-4ee4-86dd-d78275e78b6e
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
PostRouter.post(
	'/posts',
	authenticateUser,
	async (req: TypedRequestBody<{ title: string; content: string; authorId: string }>, res: Response) => {
		const { title, content, authorId } = req.body;
		console.log('req.body', { req });
		const postController = new PostController();
		const response = await postController.createPost({ title, content, authorId });
		res.status(response.status).json(response);
	},
);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     tags:
 *     - Post
 *     description: Get a post by id
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *         required: true
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
PostRouter.get('/posts/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	const postController = new PostController();
	const response = await postController.getPostById(id);
	res.status(response.status).json(response);
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags:
 *     - Post
 *     description: Delete post
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *         required: true
 *     responses:
 *      '200':
 *        description: 'Post deleted successfully'
 *      '400':
 *        description: Could not get posts
 */
PostRouter.delete('/posts/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	const postController = new PostController();
	const response = await postController.deletePost(id);
	res.status(200).json(response);
});

export default PostRouter;
