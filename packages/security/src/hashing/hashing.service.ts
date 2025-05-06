import { container } from 'tsyringe';

import { Hasher } from './hashing.interface';

export class HashingService {
  constructor(private readonly hasher: Hasher) {
    this.hasher = container.resolve<Hasher>('Hasher');
  }

  async hash(plainPassword: string): Promise<string> {
    return this.hasher.hash(plainPassword);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return this.hasher.compare(value, hash);
  }
}
