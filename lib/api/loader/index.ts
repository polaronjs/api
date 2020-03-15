import { ComponentStore } from './store';
import { ThrustrComponentRef } from '../typings/ThrustrComponent';

export const register = (key: string, ref: ThrustrComponentRef) => {
  ComponentStore.resolve().add(key, ref);
}

export const hydrate = () => {
  ComponentStore.resolve().hydrate();
}

export const Store = ComponentStore.resolve();