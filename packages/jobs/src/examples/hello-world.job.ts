import { JobTask } from '../queue/job-task';

type HelloWorldJobData = {
  name: string;
};

export class HelloWorldJob extends JobTask {
  static readonly jobName = 'hello_world';

  constructor(public readonly data: HelloWorldJobData) {
    super(data);
  }

  async execute(): Promise<string> {
    const ret = `[HelloWorldJob] Hello ${this.data.name}!`;

    return ret;
  }
}
