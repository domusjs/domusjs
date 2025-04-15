import bcrypt from 'bcrypt';
import { Hasher } from './hashing.interface';

export class BcryptHasher implements Hasher {
  private readonly saltRounds = 10;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
