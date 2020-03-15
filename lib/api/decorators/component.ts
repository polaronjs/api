import { register } from '../loader';
import { ThrustrComponentRef } from '../typings/ThrustrComponent';

export function Component(name: string) {
  return function(ref: ThrustrComponentRef) {
    register(name, ref);
  }
}