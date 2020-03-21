import { ComponentLayer } from '../components';
import { ThrustrComponentToken } from '../typings/ThrustrComponent';

export function Component(token: ThrustrComponentToken) {
  ComponentLayer.register(token);
}