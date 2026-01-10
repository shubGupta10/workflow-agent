import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const CACHE_TTL_SECONDS = 60 * 60 * 12;
export const PR_REVIEW_CACHE_TTL = 60 * 60 * 2; 

const redis = new Redis((redisUrl), {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true
});

export default redis;

redis.on('connect', () => {
    console.log('Connected to Redis server');
})

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});