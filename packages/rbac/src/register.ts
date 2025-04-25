import { container } from 'tsyringe';

import { RBACService } from './rbac.interface';
import { BasicRBACService } from './rbac.service';

export function registerRBACModule() {
  container.register<RBACService>('RBACService', {
    useClass: BasicRBACService,
  });
}
