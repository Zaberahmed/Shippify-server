import { createClient } from 'redis';
import configData from '../../config';

const redis = createClient({
    url: configData.REDIS_URL
});
// redis.on('error', (err) => console.log('Redis Client Error', err));

export default redis;