import { Request, Response, NextFunction } from 'express';

export interface PolaronQuery<T> {
  query?: PolaronPropertyQuery<T>;
  sorting?: { property: string; direction?: 1 | -1 };
  pagination?: { limit?: number; offset?: number };
}

export type PolaronPropertyQuery<T> = Partial<T> & {
  search?: string;
  regex?: string[];
  [key: string]: any;
};

export function Query() {
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
          const { req } = expressBundle;

          const formattedQuery: PolaronQuery<any> = {};
          const { offset, limit, sortBy, sortDirection, ...query } = req.query;

          // build formatted query
          Object.assign(formattedQuery, {
            pagination: { offset: parseInt(offset), limit: parseInt(limit) },
            sorting: { property: sortBy, direction: parseInt(sortDirection) },
            query,
          });

          return original.apply(this, [formattedQuery, expressBundle]);
        } else {
          // this wasn't called from express, ignore express overhead
          return original.apply(this, [...args, false]);
        }
      };
    }

    return descriptor;
  };
}
