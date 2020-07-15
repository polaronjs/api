import 'reflect-metadata';

import { Injector } from '@phantomcms/injector';

import { start } from './api';
import { Core } from './api/core';

// data layer
import { connect } from './api/data';

// system messages
import { STARTING, READY } from './api/messages';

// http helpers
export { Route } from './api/http/route';
export { Params } from './api/http/params';
export { Authorize } from './api/http/authorize';
export { Query } from './api/http/query';
export { StatusCode } from './api/http/status';

// core config
export const { config } = Injector.resolve(Core);

export default async (callback?: () => void) => {
  STARTING();

  // data layer
  await connect();

  start(() => {
    READY();

    if (callback) {
      callback();
    }
  });
};
