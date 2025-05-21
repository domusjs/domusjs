# ⏰ Cron Module

This module provides a simple and extensible scheduler to handle **repetitive or scheduled tasks** (e.g. every hour, once per day) using [node-cron](https://www.npmjs.com/package/node-cron).

It is ideal for **infrastructure-related concerns** such as:

- Periodic data cleanup
- External API syncing
- Sending scheduled reports
- Triggering background logic at fixed intervals

---

## ✅ When to Use This Module

Use the Cron module when:

| Scenario                                 | Should Use Cron? |
| ---------------------------------------- | ---------------- |
| You need to run logic every 5 minutes    | ✅ Yes           |
| You want to clean expired sessions daily | ✅ Yes           |

## 🧱 Architecture

This module integrates with the **dependency injection container** (`tsyringe`) like the rest of the system.

Each bounded context can register its own cron jobs using the shared `CronScheduler` service resolved from the container.

> The scheduler itself is started only once, after all jobs have been registered.

## 🧠 Concepts

### `CronScheduler`

Central scheduler that allows registering cron jobs.

```ts

const scheduler = container.resolve<CronScheduler>('CronScheduler');

scheduler.register({
  name: 'daily-cleanup',
  schedule: '0 2 * * *',
  task: () => { ... }
});
```

### Cron Expression Format

Follows [cron format](https://crontab.guru)

---

## 🧩 Example: Registering a job from a bounded context

📄 `/contexts/sessions/register.ts`

```ts
import { container } from 'tsyringe';
import { CronScheduler } from '../../shared/modules/cron/cron.scheduler';

export function registerSessionsContextCronJobs() {
  const scheduler = container.resolve<CronScheduler>('CronScheduler');

  scheduler.register({
    name: 'cleanup-expired-sessions',
    schedule: '0 * * * *', // every hour
    task: async () => {
      // You can dispatch a command from here
      const commandBus = container.resolve<CommandBus>('CommandBus');
      await commandBus.dispatch(new CleanupExpiredSessionsCommand());
    },
  });
}
```

---

## 🛠 Initialization Order (IMPORTANT)

In your main bootstrap file (`project.bootstrap.ts` or similar):

```ts
import { registerCronModule, startSchedulers } from '@domusjs/cron';

registerAuthModule();
registerStorageModule();
registerJobsModule();
registerSecurityModule();

registerCronModule(); // ← this must be called before registerSessionsContextCronJobs() so the scheduler registry is available to the context
registerSessionsContextCronJobs(); // Register context-level cron jobs

// ... Any other bounded context cron jobs can be registered here

startSchedulers(); // Finally, start the scheduler
```

---

## 🧼 Best Practices

- Keep jobs stateless and idempotent.
- Avoid putting cron job definitions in `shared` or similar; let each bounded context register its own.
- Schedule jobs only once, and always from the context they belong to.
