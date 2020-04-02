import { ThrustrError, InternalError } from '.';

const errorMappings = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500,
};

export function mapErrorToHttp(error: ThrustrError) {
  const { name, message } = error;

  return error instanceof ThrustrError
    ? {
        message,
        code: errorMappings[name] || errorMappings.INTERNAL_ERROR,
      }
    : { ...new InternalError(), code: errorMappings.INTERNAL_ERROR };
}
