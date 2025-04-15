import { container } from 'tsyringe';
import { JWTService } from './jwt/jwt.service';

export function registerAuthModule() {
  container.register<JWTService>('JWTService', { useClass: JWTService });
}
