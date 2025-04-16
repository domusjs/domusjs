

import { JobTask } from '../queue/job-task';

type SimpleAdderJobData = {
    a: number;
    b: number;
}

export class SimpleAdderJob extends JobTask {

    static readonly jobName = 'simple_adder';

    constructor(
        public readonly data: SimpleAdderJobData
    ) {
        super(data);
    }

    async execute(): Promise<void> {
        console.log(`[SimpleAdderJob] ${this.data.a} + ${this.data.b} = ${this.data.a + this.data.b}`);
    }
}
