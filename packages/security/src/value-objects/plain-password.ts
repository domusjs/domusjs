export class PlainPassword {
  private constructor(private readonly value: string) {}

  public static create(
    value: string,
    validateFn: (value: string) => boolean = PlainPassword.defaultValidation
  ): PlainPassword {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('[PlainPassword] Password must be a non-empty string');
    }

    if (!validateFn(value)) {
      throw new Error('[PlainPassword] Password does not meet validation requirements');
    }

    return new PlainPassword(value);
  }

  public getValue(): string {
    return this.value;
  }

  private static defaultValidation(value: string): boolean {
    return value.length >= 6 && value.length <= 64;
  }
}
