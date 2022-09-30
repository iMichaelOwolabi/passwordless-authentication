import { config } from 'dotenv';
import { Client } from 'redis-om';

config();

const redisConnectionString = `redis://${process.env.REDIS_DB_USER}:${process.env.REDIS_DB_PASS}@${process.env.REDIS_DB_URL}`;

const redisClient = new Client();

await redisClient.open(redisConnectionString);

export { redisClient };
