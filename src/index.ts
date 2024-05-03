import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { DataSource } from 'typeorm';
import { Post, User, Like } from './entities';
import router from './routes';
import { getSwaggerSpec } from './utils/swagger';
import 'dotenv/config';
import cors from 'cors';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	database: 'vibe',
	entities: [Post, User, Like],
	migrations: [],
	logging: true,
	synchronize: true,
	// cache: {
	// 	type: 'redis',
	// 	options: {
	// 		host: 'localhost',
	// 		port: 6379,
	// 		family: 6,
	// 	},
	// },
});

const main = async () => {
	await AppDataSource.initialize();

	const app = express();

	app.use(
		'cors',
		cors({
			credentials: true,
			origin: ['http://localhost:4001', 'http://localhost:3000', 'https://studio.apollographql.com'],
		}),
	);

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
