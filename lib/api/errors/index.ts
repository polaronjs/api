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

export abstract class ThrustrError {
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
export class UnauthorizedError extends ThrustrError {
  name = 'UNAUTHORIZED';
  type = ErrorType.CLIENT;
}

// authenticated, but not authorized to proceed
export class ForbiddenError extends ThrustrError {
  name = 'FORBIDDEN';
  type = ErrorType.CLIENT;
}

export class NotFoundError extends ThrustrError {
  name = 'NOT_FOUND';
  type = ErrorType.CLIENT;
}

export class BadRequestError extends ThrustrError {
  name = 'BAD_REQUEST';
  type = ErrorType.CLIENT;
}

export class InternalError extends ThrustrError {
  name = 'INTERNAL_ERROR';
  type = ErrorType.SERVER;
}
