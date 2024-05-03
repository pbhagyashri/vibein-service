import { Router, Response } from 'express';
import { TypedRequestBody } from '../types';
import { AuthController } from '../controllers/auth-controller';

const authRouter = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *     - Identity
 *     description: Register a new user
 *     requestBody:
 *      required: true
 *      description: Register a new user
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *             - username
 *           properties:
 *             email:
 *               type: string
 *               default: reva@test.com
 *             password:
 *               type: string
 *               default: reva
 *             username:
 *               type: string
 *               default: reva
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
 *     - Identity
 *     description: Authenticate an existing user
 *     requestBody:
 *      required: true
 *      description: Authenticate an existing user
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               default: reva@test.com
 *             password:
 *               type: string
 *               default: reva
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

	const controller = new AuthController();
	try {
		const accessToken = await controller.login({ email, password }, res);

		return res.json(accessToken);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *     - Identity
 *     description: Logout an existing user
 *     requestBody:
 *      description: Logout an existing user
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               default: ganesh@test.com
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 *              example: 'user logged out successfully'
 *      '400':
 *        description: Invalid status value
 */
authRouter.post('/logout', async (req: TypedRequestBody<{ email: string }>, res: Response) => {
	const { email } = req.body;

	const controller = new AuthController();
	try {
		await controller.logout(email, res);

		return res.json({ message: 'User logged out successfully' });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

/**
 * @swagger
 * /refresh-token:
 *   get:
 *     tags:
 *     - Identity
 *     description: Returns an access token upon successful validation of the refresh token
 *     responses:
 *      '200':
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *      '400':
 *        description: Invalid status value
 */
authRouter.get('/refresh-token', async (req, res) => {
	const controller = new AuthController();
	try {
		const accessToken = await controller.refreshToken(req, res);

		return res.json(accessToken);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

export default authRouter;
