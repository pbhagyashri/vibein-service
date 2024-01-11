import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authorizeUser = (req: any, res: any, next: NextFunction) => {
	const { id } = req.params;
	const refreshToken = req.headers.cookie?.split('=')[1];

	if (!refreshToken) {
		throw new Error('No refreshToken found');
	}

	return jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET as string,
		async (err: Error | null, decoded: any) => {
			if (err) {
				throw new Error('Invalid refreshToken');
			}

			const { userId } = decoded;
			const loggedInUserId = userId === id;

			if (!loggedInUserId) {
				return res.status(403).send('You can only access your own posts');
			}
			next();
		},
	);
};
