import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Response, Express } from 'express';

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Express API with Swagger',
			version: '1.0.0',
		},
		host: 'localhost:4000',
		basePath: '/',
	},
	apis: ['src/routes/*.ts', 'src/controllers/*.ts'], // path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export function getSwaggerSpec(app: Express) {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	app.get('/api-docs.json', (_, res: Response) => {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});
}
