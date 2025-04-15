import { container } from 'tsyringe';
import { Hasher } from './hashing.interface';
import { PlainPassword } from '../value-objects/plain-password';

export class HashingService {
  constructor(
    private readonly hasher: Hasher
  ) {
    this.hasher = container.resolve<Hasher>('Hasher');  
  }

  async hash(plainPassword: PlainPassword): Promise<string> {
    return this.hasher.hash(plainPassword.getValue());
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return this.hasher.compare(value, hash);
  }
}
