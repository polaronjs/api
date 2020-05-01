export interface Error {
  name: string;
  type: ErrorType;
  message?: string;
  trace?: any;
}

export enum ErrorType {
  CLIENT = 'client',
  SERVER = 'server',
}

export abstract class PhantomError {
  abstract name: string;
  abstract type: ErrorType;

  message?: string;
  trace?: string;

  constructor(props?: { message?: string; trace?: any }) {
    this.message = props ? props.message : undefined;
    this.trace = props ? props.trace : undefined;
  }
}

// not authenticated at all or not authenticated correctly
export class UnauthorizedError extends PhantomError {
  name = 'UNAUTHORIZED';
  type = ErrorType.CLIENT;
}

// authenticated, but not authorized to proceed
export class ForbiddenError extends PhantomError {
  name = 'FORBIDDEN';
  type = ErrorType.CLIENT;
}

export class NotFoundError extends PhantomError {
  name = 'NOT_FOUND';
  type = ErrorType.CLIENT;
}

export class BadRequestError extends PhantomError {
  name = 'BAD_REQUEST';
  type = ErrorType.CLIENT;
}

export class InternalError extends PhantomError {
  name = 'INTERNAL_ERROR';
  type = ErrorType.SERVER;
}
