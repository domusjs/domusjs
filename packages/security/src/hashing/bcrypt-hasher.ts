import bcryptjs from 'bcryptjs';

import { Hasher } from './hashing.interface';

export class BcryptHasher implements Hasher {
  private readonly saltRounds = 10;

  async hash(value: string): Promise<string> {
    return bcryptjs.hash(value, this.saltRounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(value, hash);
  }
}
