import jwt from 'jsonwebtoken';

export class JWTService<AuthPayload extends object = any> {

  constructor(
    private readonly secret: string,
    private readonly expiresIn: jwt.SignOptions['expiresIn']
  ) {}

  sign(payload: AuthPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): AuthPayload {
    return jwt.verify(token, this.secret) as AuthPayload;
  }
}
