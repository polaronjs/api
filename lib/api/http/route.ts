import { Request, Response, NextFunction } from 'express';

export function Route(...bindings: string[]) {
  return function (target, name, descriptor) {
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (
        ...args: [Request, Response, NextFunction]
      ) {
        const [req, res, next] = args;

        if (req && req.path && res && res.send) {
          // this was forwarded from express, handle route
          try {
            const translatedArgs = [];

            for (const binding of bindings) {
              if (binding === 'parsedQuery') {
                translatedArgs.push(req['parsedQuery']);
              } else {
                const path = binding.split('.');
                let valueAtPath = req;

                while (path.length) {
                  valueAtPath = valueAtPath[path[0]];
                  path.shift();
                }

                translatedArgs.push(valueAtPath);
              }
            }

            const result = await original.apply(this, [
              ...translatedArgs,
              true,
            ]);
            const { status, payload } = result;

            if (status || payload) {
              res.status(status || 200).send(payload || {});
            } else {
              res.send(result);
            }
          } catch (error) {
            next(error);
          }
        } else {
          // function was called directly, ignore express overhead
          const result = await original.apply(this, [...args, false]);
          if (result && result.status && result.payload) {
            return result.payload;
          }

          return result;
        }
      };
    }

    return descriptor;
  };
}
