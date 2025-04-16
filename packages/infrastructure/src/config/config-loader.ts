
import './env';
import jwt from 'jsonwebtoken';
function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`[DomusJS Config] Missing environment variable: ${name}`);
  }
  return value;
}

export const domusConfig = {
  env: getEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  port: parseInt(getEnv('PORT', '3000'), 10),

  // JWT module
  jwt: {
    secret: getEnv('JWT_SECRET', 'changeme'),
    expiresIn: getEnv('JWT_EXPIRES_IN', '1h') as jwt.SignOptions['expiresIn'],
  },

  // RabbitMQ (event/command/query bus)
  rabbitmq: {
    url: getEnv('RABBITMQ_URL', 'amqp://localhost'),
    exchange: getEnv('RABBITMQ_EXCHANGE', 'domain_events'),
  },

  // Jobs module (BullMQ / Redis)
  redis: {
    url: getEnv('REDIS_URL', 'redis://localhost:6379'),
    host: getEnv('REDIS_HOST', 'localhost'),
    port: getEnv('REDIS_PORT', '6379'),
    password: getEnv('REDIS_PASSWORD', ''),
  },

  // Storage (S3-compatible or local)
  storage: {
    driver: getEnv('STORAGE_DRIVER', 'local'), // local | s3 | etc
    localPath: getEnv('STORAGE_LOCAL_PATH', './uploads'),
    s3: {
      bucket: getEnv('S3_BUCKET', ''),
      region: getEnv('S3_REGION', ''),
      accessKeyId: getEnv('S3_ACCESS_KEY_ID', ''),
      secretAccessKey: getEnv('S3_SECRET_ACCESS_KEY', ''),
    },
  },
};
