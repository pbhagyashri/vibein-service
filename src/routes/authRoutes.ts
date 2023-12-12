import { Router, Response } from 'express';
import { TypedRequestBody } from '../types';
import { AuthController } from '../controllers/userController';

const authRouter = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *     - User
 *     description: Register a new user
 *     requestBody:
 *      description: add a new user to the database
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           required:
 *             - email
 *             - username
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               default: ganesh@test.com
 *             username:
 *               type: string
 *               default: ganesh
 *             password:
 *               type: string
 *               default: ganesh
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      '400':
 *        description: Invalid status value
 */
authRouter.post(
	'/register',
	async (req: TypedRequestBody<{ username: string; password: string; email: string }>, res: Response) => {
		const { email, username, password } = req.body;
		const controller = new AuthController();
		try {
			const user = await controller.register({ email, username, password }, res);
			return res.json(user);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	},
);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *     - User
 *     description: Authenticate an existing user
 *     requestBody:
 *      description: Authenticate an existing user
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           required:
 *             - email
 *             - username
 *           properties:
 *             email:
 *               type: string
 *               default: ganesh@test.com
 *             password:
 *               type: string
 *               default: ganesh
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      '400':
 *        description: Invalid status value
 */
authRouter.post('/login', async (req: TypedRequestBody<{ email: string; password: string }>, res: Response) => {
	const { email, password } = req.body;
	console.log({ email, password });
	const controller = new AuthController();
	try {
		const accessToken = await controller.login({ email, password }, res);

		return res.json(accessToken);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

export default authRouter;
