import Redis from 'ioredis';
import 'dotenv/config';

const redisUrl = () => {
	if (process.env.REDIS_CONNECTION_URL) {
		return process.env.REDIS_CONNECTION_URL;
	}
	throw new Error('REDIS_CONNECTION_URL not found');
};

export const redis = new Redis(redisUrl());
