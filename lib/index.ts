import 'reflect-metadata';

import { Injector } from './api/injector';

import { start } from './api';
import { ThrustrCore } from './api/core';

// data layer
import { connect } from './api/data';

// system messages
import { STARTING, READY } from './api/messages';

// http helpers
export { Route } from './api/http/route';
export { StatusCode } from './api/http/status';

// export type of ThrustrCore, not actual class
export { ThrustrCore as Core } from './api/core';

// core config
export const { config } = Injector.resolve(ThrustrCore);

// injector exports
export { Injectable, inject } from './api/injector';

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
