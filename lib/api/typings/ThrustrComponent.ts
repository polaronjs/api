import { ThrustrCore } from '../core';

export interface ThrustrComponent {}

export type ThrustrComponentToken = new (...args: any[]) => ThrustrComponent;
