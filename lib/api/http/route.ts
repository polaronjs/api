import { Request, Response, NextFunction } from 'express';
import { Injector } from '@phantomcms/injector';
import { Tokenizer } from '../services';
import { Core } from '../core';
import { PhantomError } from '../errors';
import { Entity } from '../data/entities';
import { User } from '../data/entities/user';

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
  middleware,
}: {
  method: HttpMethod;
  route: string;
  middleware?: any[];
}) {
  return function (target, functionName: string, descriptor) {
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (
        ...args: [Request, Response, NextFunction] | any[]
      ) {
        const [req, res, next] = args as [Request, Response, NextFunction];

        if (req && req.path && res && res.send) {
          // this was called from express

          try {
            // extract any supplied bearer tokens and append contents to req.user
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

            // create bundle of express objects and pass to next decorator in chain
            const expressBundle = {
              req,
              res,
              next,
              requester: req['user']
                ? Entity.from<User>(req['user'])
                : undefined,
            };

            // handle express functionality
            const result = await original
              // we bind the original function to the instance of `target` from the Injector store for the `this` context
              .bind(Injector.resolve(target.constructor))
              .apply(this, [expressBundle]);

            res.send(result);

            return result;
          } catch (error) {
            console.log(error);
            if (!(error instanceof PhantomError)) {
              console.error(error);
            }
            next(error);
          }
        } else {
          // function was called directly, ignore express overhead and pass `false` for expressBundle
          return original.apply(this, [...args, false]);
        }
      };

      // resolve the Core object to get the instance of Router
      const { router } = Injector.resolve(Core);

      // map the new function to the given route/method combination
      router[method](route, ...(middleware || []), descriptor.value);
    }

    return descriptor;
  };
}
