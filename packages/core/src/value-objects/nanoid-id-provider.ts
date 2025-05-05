// packages/core/src/value-objects/nanoid-id-provider.ts

import { nanoid } from 'nanoid';
import { UniqueIdProvider } from './unique-id-provider.interface';

export class NanoIdProvider implements UniqueIdProvider {
  constructor(private readonly size: number = 21) {}

  generate(): string {
    return nanoid(this.size);
  }
}
