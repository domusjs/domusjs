export abstract class JobTask<R = any> {
  static readonly jobName: string;
  constructor(public readonly data: any) {}

  abstract execute(): Promise<R>;
}
