import { UniqueIdProvider } from './unique-id-provider.interface';
import { UUIDProvider } from './uuid-id-provider';

export class UniqueEntityId {
  private readonly _value: string;

  constructor(id?: string, provider: UniqueIdProvider = new UUIDProvider()) {
    if (id) {
      this._value = id;
    } else {
      this._value = provider.generate();
    }
  }

  toString(): string {
    return this._value;
  }

  equals(id: UniqueEntityId): boolean {
    return this._value === id.toString();
  }
}
