import { Response, NextFunction } from 'express'
import redis from '../lib/redis'
import { AuthRequest } from './auth.middleware';

type RateLimitOptions = {
    key: string;
    limit: number;
    windowInSeconds: number;
}

export const rateLimit = ({ key, limit, windowInSeconds }: RateLimitOptions) =>
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const redisKey = `ratelimit:${key}:${user.userId}`;
        const current = await redis.incr(redisKey);

        if (current === 1) {
            await redis.expire(redisKey, windowInSeconds);
        }

        if (current > limit) {
            return res.status(429).json({
                message: `Rate limit exceeded. Try again in ${windowInSeconds} seconds.`
            })
        }

        next();
    }