import { DataSourceToken } from '../data/DataSource';
import { DataLayer } from '../data';

export function UseDatabase(
  database: DataSourceToken<any>,
  path: string
) {
  DataLayer.add(database);

  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      db = DataLayer.resolve(database);
    };
  };
}
