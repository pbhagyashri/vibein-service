import { Response } from 'express';
import { authenticateUser } from '../middlewares/authenticateUser';
import { UserController } from '../controllers/userController';
import { Router } from 'express';
import { authorizeUser } from '../middlewares/authorizeUser';

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
 *     name: id
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

export default UserRouter;
