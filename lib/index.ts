import { start } from './api';
import { ThrustrCore as core } from './api/core';

// component loader
import { ComponentLayer } from './api/components';

// system messages
import { STARTING, READY } from './api/messages';

// export function hook to register components without exporting entire ComponentLayer
export const registerComponent = ComponentLayer.register;

// component helpers
export { Route } from './api/decorators/route';
export { StatusCode } from './api/decorators/status';
export { Component } from './api/decorators/component';

// export type of ThrustrCore, not actual class
export type ThrustrCore = core;

// core config
export const { config } = core.resolveInstance();

export default (callback?: () => void) => {
  STARTING();

  // hydrate component layer
  ComponentLayer.hydrate();

  start(() => {
    READY();

    if (callback) {
      callback();
    }
  });
};