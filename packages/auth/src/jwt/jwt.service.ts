import jwt from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

@injectable()
export class JWTService<AuthPayload extends object = any> {
  constructor(
    @inject('TokenSecret') private readonly secret: string,
    @inject('TokenExpiry') private readonly expiresIn: jwt.SignOptions['expiresIn']
  ) {}

  sign(payload: AuthPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): AuthPayload {
    return jwt.verify(token, this.secret) as AuthPayload;
  }
}
