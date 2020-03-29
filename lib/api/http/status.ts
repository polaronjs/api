import { Request, Response, NextFunction } from 'express';

export function StatusCode(status: number) {
  return function (target, name, descriptor) {
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (...args: any[]) {
        const expressBundle: {
          req: Request;
          res: Response;
          next: NextFunction;
        } = args.slice(-1)[0];

        if (expressBundle) {
          // this was forwarded from express, set appropriate status code
          expressBundle.res.status(status);
        }

        return original.apply(this, args, expressBundle);
      };
    }

    return descriptor;
  };
}
