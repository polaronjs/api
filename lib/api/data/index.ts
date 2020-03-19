import { DataSourceToken, DataSource } from './DataSource';

// TODO improve error messags
export class DataLayer {
  private tokens = new Set<DataSourceToken<any>>();
  private sources = new Map<DataSourceToken<any>, DataSource<any>>();

  private static hydrated: boolean;
  private static instance: DataLayer;

  private constructor() {}

  static resolve<T>(token: DataSourceToken<T>): DataSource<T> {
    if (!this.instance) {
      return undefined;
    }

    console.log('resolving...', this.instance.sources);

    return this.instance.sources.get(token);
  }

  static add(token: DataSourceToken<any>) {
    if (this.hydrated) {
      throw new Error('Cannot add data from token, Data Layer already hydrated');
    }

    if (!this.instance) {
      this.instance = new DataLayer();
    }

    this.instance.tokens.add(token);
  }

  static remove(token: DataSourceToken<any>) {
    if (!this.hydrated) {
      throw new Error('Cannot remove data from token, Data Layer not hydrated');
    }

    if (!this.instance) {
      throw new Error('Cannot remove data from token, Data Layer not defined');
    }

    this.instance.sources.delete(token);
  } 

  static hydrate() {
    if (this.hydrated) {
      throw new Error('Cannot hydrate Data Layer, already hydrated');
    }

    if (!this.instance) {
      throw new Error('Cannot hydrate Data Layer, Data Layer not defined');
    }

    for (let token of this.instance.tokens) {
      this.instance.sources.set(token, new token())
    }

    this.hydrated = true;
  }
}