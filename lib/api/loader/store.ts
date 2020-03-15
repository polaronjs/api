import {
  ThrustrComponentRef,
  ThrustrComponent
} from '../typings/ThrustrComponent';
import { ThrustrCore } from '../core';
import * as chalk from 'chalk';

export class ComponentStore {
  private hydrated: boolean;
  private components = new Map<
    string,
    ThrustrComponentRef | ThrustrComponent
  >();

  private static instance: ComponentStore;

  private constructor() {}

  public static resolve() {
    if (!this.instance) {
      this.instance = new ComponentStore();
    }

    return this.instance;
  }

  add(key: string, componentRef: ThrustrComponentRef) {
    if (this.hydrated) {
      throw new Error(
        'Components cannot be added to store after it has been initialized'
      );
    }

    this.components.set(key, componentRef);
  }

  get(key: string): ThrustrComponent {
    if (!this.hydrated) {
      throw new Error('Component cannot be retrieved before it is hydrated');
    }

    return this.components.get(key);
  }

  hydrate() {
    this.hydrated = true;

    this.components.forEach((value, key) => {
      this.components.set(
        key,
        new (value as ThrustrComponentRef)(ThrustrCore.resolve())
      );
      console.log(
          chalk.green('[Component Hyrdated]:'),
          chalk.yellow(`\`${(value as ThrustrComponentRef).name}\` as '${key}'`)
      );
    });
  }
}
