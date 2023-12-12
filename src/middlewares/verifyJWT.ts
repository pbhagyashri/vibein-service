import jwt from 'jsonwebtoken';

export const verifyJWT = (req: any, res: any, next: any) => {
	const authHeader = req.headers['authorization'];

	if (!authHeader) return res.status(401).send('Access Denied');
	const token = authHeader.split(' ')[1];

	try {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: Error | null, decoded: any) => {
			console.log('decoded', { decoded });
			if (err) {
				console.log('err', err);
				return res.status(401).send('Access Denied');
			}
			req.user = decoded?.username;
			next();
		});
	} catch (err) {
		res.status(400).send('Invalid Token');
	}
};
