import { Hasher } from './hashing.interface';
import { injectable, inject } from 'tsyringe';
@injectable()
export class HashingService {
  constructor(@inject('Hasher') private readonly hasher: Hasher) {}

  async hash(plainPassword: string): Promise<string> {
    return this.hasher.hash(plainPassword);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return this.hasher.compare(value, hash);
  }
}
