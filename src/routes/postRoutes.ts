import { Router, Response, Request } from 'express';
import { Cursor, ResponseType, PaginationResponse, PostType } from '../types';
import { PostController } from '../controllers/post-controller/PostController';

const PostRouter = Router();
/**
 * @swagger
 * /posts?limit={limit}:
 *   get:
 *     tags:
 *     - Post
 *     description: Get all posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     - name: limit
 *       in: query
 *       description: 'limits the number of posts returned'
 *       required: true
 *       type: number
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
 * /posts?cursor[id]={id}%[createdAt]={createdAt}&limit={limit}:
 *   get:
 *     tags:
 *     - Post
 *     description: Get all posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     - name: limit
 *       in: query
 *       description: 'limits the number of posts returned'
 *       required: true
 *       schema:
 *         type: number
 *         format: int32
 *         default: 4
 *     - name: cursor
 *       in: query
 *       schema:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *             default: 55163961-1d19-46bb-9347-993ba9740a69
 *           createdAt:
 *             type: string
 *             format: date-time
 *             default: 2024-02-23T18:38:45.472Z
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
PostRouter.get(
	'/posts',
	async (req: Request, res: Response): Promise<Response<ResponseType<PaginationResponse<PostType>>>> => {
		const { limit, cursor } = req.query;
		const limitNumber = parseInt(limit?.toString() || '9');
		const cursorObject: Cursor = cursor ? JSON.parse(cursor.toString()) : undefined;

		const postController = new PostController();
		const response = await postController.getPosts(limitNumber, cursorObject);

		return res.status(200).json(response);
	},
);

PostRouter.get('/posts/count', async (_, res: Response) => {
	const postController = new PostController();
	const response = await postController.getPostCount();
	res.json(response);
});

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     tags:
 *     - Post
 *     description: Get a post by id
 *     security:
 *       - bearerAuth: []
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
 * /posts:
 *   patch:
 *     tags:
 *     - Post
 *     description: Add likes to a post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - postId
 *             properties:
 *               userId:
 *                 type: string
 *                 default: b8e61310-69d6-4c7a-a6de-003f725463dc
 *               postId:
 *                 type: string
 *                 default: 60255cf6-43e3-4734-86c7-a4f8ddb018fb
 *     responses:
 *      '200':
 *        description: 'Post liked successfully'
 *      '400':
 *        description: Could not get posts
 */
// add likes to a post
// PostRouter.patch('/posts', authenticateUser, async (req: Request, res: Response) => {
// 	const { userId } = req.body;

// 	const postController = new PostController();
// 	const response = await postController.likePost(userId);
// 	res.status(response.status).json(response);
// });

export default PostRouter;
