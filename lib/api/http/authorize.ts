import { AccessLevel, User } from '../data/entities/user';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../errors';

export interface RouteComparer {
  minimumAccessLevel?: AccessLevel;
  preExecAuth?: (user: User, req: Request) => boolean | Promise<boolean>;
  postExecAuth?: (
    user: User,
    req: Request,
    result: any
  ) => boolean | Promise<boolean>;
}

export function Authorize(conditions?: RouteComparer) {
  return function (target, name, descriptor) {
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = async function (...args: any[]) {
        const {
          req,
        }: {
          req: Request;
          res: Response;
          next: NextFunction;
        } = args.slice(-1)[0];

        if (req) {
          if (!req['user']) {
            throw new UnauthorizedError();
          } else if (conditions) {
            // at this point we know the requester's identity
            // the route has conditions, perform authorization checks
            const {
              minimumAccessLevel,
              preExecAuth,
              postExecAuth,
            } = conditions;
            const user: User = req['user'];
            const error = () => {
              throw new ForbiddenError();
            };

            if (minimumAccessLevel && user.accessLevel < minimumAccessLevel) {
              error();
            }

            if (preExecAuth && !(await preExecAuth(user, req))) {
              error();
            }

            if (postExecAuth) {
              const result = await original.apply(this, args);

              if (!(await postExecAuth(user, req, result))) {
                error();
              }

              return result;
            } else {
              return original.apply(this, args);
            }
          }
        }
      };
    }
  };
}
