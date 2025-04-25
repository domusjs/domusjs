import { container } from 'tsyringe';

import { CronScheduler } from './cron.scheduler';

const schedulerInstance = new CronScheduler();

export function registerCronModule() {
  container.register<CronScheduler>('CronScheduler', {
    useValue: schedulerInstance,
  });
}
