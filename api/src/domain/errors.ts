export class DomainError extends Error {
  constructor(
    readonly code: string,
    message: string
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super("validation_error", message);
  }
}

export class NotFoundError extends DomainError {
  constructor(message = 'Not Found') {
    super("not_found", message);
  }
}

export class ConflictError extends DomainError {}