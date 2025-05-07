// packages/core/src/value-objects/nanoid-id-provider.ts

//import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { UniqueIdProvider } from './unique-id-provider.interface';

export class NanoIdProvider implements UniqueIdProvider {
  constructor(private readonly size: number = 21) {}

  generate(): string {
    return uuidv4();
  }
}
