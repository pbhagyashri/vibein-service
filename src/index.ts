import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
import { Post, User } from './entities';
import router from './routes/index';
import { getSwaggerSpec } from './utils/swagger';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	database: 'lireddit',
	entities: [Post, User],
	migrations: [],
	logging: true,
	synchronize: true,
});

const main = async () => {
	await AppDataSource.initialize();

	const app = express();

	app.use(bodyParser.json());
	app.use(router);

	app.listen(4000, () => {
		console.log('Listening on port http://localhost:4000');

		getSwaggerSpec(app);
	});
};

main().catch((err) => {
	console.error(err);
});
