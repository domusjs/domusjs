import jwt from 'jsonwebtoken';

export class JWTService<TPayload extends object = any> {

  constructor(
    private readonly secret: string,
    private readonly expiresIn: jwt.SignOptions['expiresIn']
  ) {}

  sign(payload: TPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): TPayload {
    return jwt.verify(token, this.secret) as TPayload;
  }
}
