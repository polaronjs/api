import * as chalk from 'chalk';

import { start } from './api';
import { hydrate } from './api/loader';
import { DataLayer } from './api/data';
import { ThrustrCore as core } from './api/core';

// component loader
export { register as registerComponent } from './api/loader';

// component helpers
export { Route } from './api/decorators/route';
export { StatusCode } from './api/decorators/status';
export { Component } from './api/decorators/component';

// data layer
export { DataLayer } from './api/data';

// export type of ThrustrCore, not actual class
export type ThrustrCore = core;

// core config
export const { config } = core.resolve();

export default (callback?: () => void) => {
  console.log(chalk.yellow('Starting Thrustr...'));

  // hydrate data layer
  DataLayer.hydrate();

  // hydrate component layer
  hydrate();

  // activate interfaces
  start(callback);
};