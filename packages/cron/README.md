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
|------------------------------------------|------------------|
| You need to run logic every 5 minutes    | ✅ Yes           |
| You want to clean expired sessions daily | ✅ Yes           |
| A user triggers an action via API        | ❌ No (use CommandBus) |
| You want to process a queue of tasks     | ❌ No (use Jobs module) |

---

## 🧱 Architecture

This module integrates with the **dependency injection container** (`tsyringe`) like the rest of the system.

Each bounded context can register its own cron jobs using the shared `CronScheduler` service resolved from the container.

> The scheduler itself is started only once, after all jobs have been registered.

---

## 📦 Structure

```
/shared/modules/cron/
├── cron.scheduler.ts        # CronScheduler class (register + start)
├── register.ts              # Registers CronScheduler in DI + starts all jobs
├── jobs/
│   └── example.cron-job.ts  # Example: a job that logs every minute
└── README.md
```

---

## 🧠 Concepts

### `CronScheduler`

Central scheduler that allows registering and starting cron jobs.

```ts
scheduler.register({
  name: 'daily-cleanup',
  schedule: '0 2 * * *',
  task: () => { ... }
});
```

### Cron Expression Format

Follows [cron format](https://crontab.guru):

| Field     | Allowed values      |
|-----------|---------------------|
| Minute    | 0–59                |
| Hour      | 0–23                |
| Day       | 1–31                |
| Month     | 1–12                |
| Weekday   | 0–7 (Sunday = 0/7)  |

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
    }
  });
}
```

---

## 🛠 Initialization Order (IMPORTANT)

In your main bootstrap file (`project.bootstrap.ts` or similar):

```ts
registerAuthModule();
registerStorageModule();
registerJobsModule();
registerSecurityModule();
registerSessionsContextCronJobs(); // Register context-level cron jobs
registerCronModule(); // ← this must be the last one to start the scheduler
```

---

## 🧼 Best Practices

- Keep jobs stateless and idempotent.
- Avoid putting cron job definitions in `shared`; let each bounded context register its own.
- Schedule jobs only once, and always from the context they belong to.
- Use this module for *recurrent* tasks; for background task queues, use the Jobs module instead.

---

## 🧩 Example Job

📄 `/shared/modules/cron/jobs/log-timestamp.job.ts`

```ts
import { container } from 'tsyringe';
import { CronScheduler } from '../cron.scheduler';

export function registerLogTimestampJob() {
  const scheduler = container.resolve<CronScheduler>('CronScheduler');

  scheduler.register({
    name: 'log-timestamp',
    schedule: '* * * * *', // every minute
    task: () => {
      console.log('🕒 Timestamp:', new Date().toISOString());
    }
  });
}
```

---

## ✅ Summary

- Register cron jobs via dependency injection from any context
- Delay starting the scheduler until all jobs are registered
- Keep infrastructure tasks decoupled from your domain logic

This module helps automate time-based logic in a clean, scalable and modular way.

---

## 🧩 Recommended Integration Pattern

For best structure and responsibility separation, it's recommended to start the cron jobs at the end of your `registerContexts()` function (not in the HTTP server itself).

📄 `/src/apps/api/contexts/registerContexts.ts`

```ts
import { registerSampleContext } from '../../examples/sample-context/register';
import { startSchedulers } from '../../shared/modules/cron/start';

export function registerContexts() {
  registerSampleContext();
  // Register other bounded contexts...

  startSchedulers(); // ✅ Start all cron jobs after registration
}
```

📄 `/src/apps/api/server.ts`

```ts
export async function startServer() {
  registerContexts(); // Includes cron job scheduling

  const app = express();
  const router = Router();

  app.use(express.json());
  registerRoutes(router);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
  });
}
```

> This keeps infrastructure concerns out of your server and close to where cron jobs are defined and registered.
