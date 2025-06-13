import { v4 as uuidv4 } from 'uuid';
import { UniqueIdProvider } from './unique-id-provider.interface';

export class UUIDProvider implements UniqueIdProvider {
  constructor() {}

  generate(): string {
    return uuidv4();
  }
}
