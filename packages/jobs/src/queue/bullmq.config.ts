import { RedisOptions } from 'bullmq';
import { domusConfig } from '@domusjs/infrastructure/src/config/config-loader';

export const connection: RedisOptions = {
  host: domusConfig.redis.host,
  port: parseInt(domusConfig.redis.port, 10),
  password: domusConfig.redis.password,
};
