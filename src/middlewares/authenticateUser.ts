import jwt from 'jsonwebtoken';

export const authenticateUser = (req: any, res: any, next: any) => {
	const authHeader = req.headers['authorization'];

	console.log({ authHeader });
	if (!authHeader) return res.status(401).send('Access Denied');
	const token = authHeader.split(' ')[1];

	try {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: Error | null, decoded: any) => {
			if (err) {
				console.log({ err });
				return res.status(401).send('Access Denied');
			}
			req.userId = decoded.userId;

			next();
		});
	} catch (err) {
		res.status(400).send('Invalid Token');
	}
};
