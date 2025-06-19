# @domusjs/cron

The `@domusjs/cron` module provides a simple, pluggable scheduler to handle repetitive or timed tasks inside your backend application.

📚 **Documentation:** [@domusjs/cron Docs](https://docs.domusjs.com/modules/cron/cron-introduction/)

---

✅ Built on top of node-cron, it enables you to run background tasks at specific intervals, such as:

- Cleaning expired data.
- Synchronizing external services.
- Sending periodic reports.
- Triggering domain commands at regular times.

---

## Installation

```bash
npm install @domusjs/cron
```

---

## Usage

```ts
import { container } from 'tsyringe';
import { CronScheduler } from '@domusjs/cron';

const scheduler = container.resolve<CronScheduler>('CronScheduler');

scheduler.register({
  name: 'simple-log-task',
  schedule: '*/5 * * * *', // Every 5 minutes
  task: async () => {
    console.log('Running scheduled task...');
  },
});
```

---

## 🔗 Learn More

For advanced aspects, check out the full documentation:

👉 [https://docs.domusjs.com](https://docs.domusjs.com)