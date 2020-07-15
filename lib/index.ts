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
export { StatusCode } from './api/http/status';

// core config
export const { config } = Injector.resolve(Core);

export default async (callback?: () => void) => {
  STARTING();

  // data layer
  await connect();

  // hydrate component layer
  // Injector.hydrate();

  start(() => {
    READY();

    if (callback) {
      callback();
    }
  });
};
