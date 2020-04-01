import { Request, Response, NextFunction } from 'express';
import { Injector } from '../injector';
import { ThrustrCore } from '../core';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
  HEAD = 'head',
  OPTIONS = 'options',
}

export function Route({
  method = HttpMethod.GET,
  route,
}: {
  method: HttpMethod;
  route: string;
}) {
  return function (target, functionName: string, descriptor) {
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (
        ...args: [Request, Response, NextFunction] | any[]
      ) {
        const [req, res, next] = args as [Request, Response, NextFunction];

        if (req && req.path && res && res.send) {
          // this was forwarded from express, create bundle of express objects and pass to next decorator in chain
          const expressBundle = { req, res, next };

          try {
            // handle express functionality
            res.send(
              await original
                // we bind the original function to the instance of `target` from the Injector store for the `this` context
                .bind(Injector.resolve(target.constructor))
                .apply(this, [...args, expressBundle])
            );
          } catch (error) {
            next(error);
          }
        } else {
          // function was called directly, ignore express overhead and pass `false` for expressBundle
          return original.apply(this, [...args, false]);
        }
      };

      // inject the ThrustrCore to get the instance of Router
      const { router } = Injector.resolve(ThrustrCore);

      // map the new function to the given route/method combination
      router[method](route, descriptor.value);
    }

    return descriptor;
  };
}
