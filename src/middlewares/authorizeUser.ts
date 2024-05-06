import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authorizeUser = (req: any, res: any, next: NextFunction) => {
	const { authorId } = req.params;

	const accessToken = req.headers.authorization.split(' ')[1];

	if (!accessToken) {
		throw new Error('No accessToken found');
	}

	return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, async (err: Error | null, decoded: any) => {
		if (err) {
			throw new Error('Invalid accessToken');
		}

		const { userId } = decoded;
		const loggedInUserId = userId === authorId;
		console.log({ userId, authorId, loggedInUserId });

		if (!loggedInUserId) {
			return res.status(403).send('You are not authorized to perform this action');
		}
		next();
	});
};
