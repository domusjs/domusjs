import jwt from 'jsonwebtoken';
import { AuthResult } from '../providers/auth-result';
import { domusConfig } from '@domusjs/infrastructure/src/config/config-loader';

const JWT_SECRET = domusConfig.jwt.secret;

export class JWTService {
  sign(payload: AuthResult): string {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: domusConfig.jwt.expiresIn
    });
  }

  static verify(token: string): AuthResult {
    return jwt.verify(token, JWT_SECRET) as AuthResult;
  }
}
