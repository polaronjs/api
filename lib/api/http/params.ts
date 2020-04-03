import { Request, Response, NextFunction } from 'express';

export function Params(...bindings: string[]) {
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
          const { req, next } = expressBundle;

          try {
            // resolve the parameter bindings
            const translatedArgs = [];

            for (const binding of bindings) {
              const path = binding.split('.');
              let valueAtPath = req;

              while (path.length) {
                valueAtPath = valueAtPath[path[0]];
                path.shift();
              }

              translatedArgs.push(valueAtPath);
            }

            return original.apply(this, [...translatedArgs, expressBundle]);
          } catch (error) {
            next(error);
          }
        } else {
          // this wasn't called from express, ignore express overhead
          return original.apply(this, [...args, false]);
        }
      };
    }

    return descriptor;
  };
}
