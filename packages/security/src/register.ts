import { container } from 'tsyringe';

import { Hasher } from './hashing/hashing.interface';
import { BcryptHasher } from './hashing/bcrypt-hasher';
import { HashingService } from './hashing/hashing.service';

export function registerSecurityModule() {
  container.register<Hasher>('Hasher', {
    useClass: BcryptHasher,
  });

  // 🧩 Wrapper service (uses Hasher under the hood)
  container.register<HashingService>('HashingService', {
    useClass: HashingService,
  });
}
