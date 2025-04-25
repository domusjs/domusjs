import { container } from 'tsyringe';

import { CronScheduler } from './cron.scheduler';

export function startSchedulers() {
  const scheduler = container.resolve<CronScheduler>('CronScheduler');
  scheduler.startAll();
}
