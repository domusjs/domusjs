import { RedisOptions } from 'bullmq';
import { domusConfig } from '@domusjs/infrastructure';

// Default connection
const defaultConnection: RedisOptions = {
  host: domusConfig.redis.host,
  port: parseInt(domusConfig.redis.port, 10),
  password: domusConfig.redis.password,
};

let customConnection: Partial<RedisOptions> = {};

/**
 * Allows user to override default Redis options
 */
export function configureBullMQConnection(overrides: Partial<RedisOptions>) {
  customConnection = overrides;
}

/**
 * Returns the final connection options (default + overrides)
 */
export function getBullMQConnection(): RedisOptions {
  return { ...defaultConnection, ...customConnection };
}
