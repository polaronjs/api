import 'reflect-metadata';

import { Injector } from './api/injector';

import { start } from './api';
import { ThrustrCore } from './api/core';

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

export default (callback?: () => void) => {
  STARTING();

  // hydrate component layer
  Injector.hydrate();

  start(() => {
    READY();

    if (callback) {
      callback();
    }
  });
};