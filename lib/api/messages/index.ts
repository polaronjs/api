import * as chalk from 'chalk';

const colors = {
  PRIMARY: chalk.blue,
  SECONDARY: chalk.yellow,
  SUCCESS: chalk.green,
  ERROR: chalk.red
}

///////////////////////
// Startup
///////////////////////

export const STARTING = () => {
  console.log(colors.PRIMARY('Starting Thrustr...'));
}

export const COMPONENT_HYDRATED = (token: string) => {
  console.log(colors.PRIMARY('[Component Hydrated]: '), colors.SECONDARY(token))
}

export const DATASOURCE_CONNECTED = (source: string) => {
  console.log(colors.PRIMARY('[Datasource Connection Established]: '), colors.SECONDARY(source))
}

export const INTERFACE_AVAILABLE = (identifier: string) => {
  console.log(colors.PRIMARY('[Interface Available]: '), colors.SECONDARY(identifier))
}

export const READY = () => {
  console.log(colors.SUCCESS('Ready for blast-off, Captain'));
}