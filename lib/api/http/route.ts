import { Request, Response, NextFunction } from 'express';
import { Injector } from '../injector';
import { Tokenizer } from '../services';
import { ThrustrCore } from '../core';
import { ThrustrError } from '../errors';

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
            // extract any supplied bearer tokens and append contents to req.user
            // @ts-ignore TODO fix this type mismatch for abstract classes
            const tokenizer = Injector.resolve(Tokenizer);

            const authHeaders = req.headers.authorization || undefined;

            if (authHeaders) {
              const [type, token] = [
                authHeaders.split(' ')[0],
                authHeaders.split(' ').slice(1).join(''),
              ];

              if (type === 'Bearer') {
                req['user'] = tokenizer.decode(token);
              }
            }

            // handle express functionality
            const result = await original
              // we bind the original function to the instance of `target` from the Injector store for the `this` context
              .bind(Injector.resolve(target.constructor))
              .apply(this, [...args, expressBundle]);

            res.send(result);

            return result;
          } catch (error) {
            if (!(error instanceof ThrustrError)) {
              console.error(error);
            }
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
