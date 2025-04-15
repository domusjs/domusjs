import cron from 'node-cron';

type CronJob = {
  schedule: string;
  name: string;
  task: () => void;
};


export class CronScheduler {
  private jobs: CronJob[] = [];

  register(job: CronJob) {
    this.jobs.push(job);
  }

  startAll() {
    for (const job of this.jobs) {
      cron.schedule(job.schedule, () => {
        console.log(`🕒 Executing cron job: ${job.name}`);
        job.task();
      });
    }
  }
}
