// TODO websockets?
// TODO config?

import { Router } from 'express';
import * as WebSocket from 'ws';
import { Injectable } from '../injector';

@Injectable({ immediate: true })
export class ThrustrCore {
  private _router = Router();
  private _ws: (ws: WebSocket) => void;
  private _config: any;

  get router() {
    return this._router;
  }

  set router(router: Router) {
    this._router = router;
  }

  get ws() {
    return this._ws;
  }

  set ws(ws: (ws: WebSocket) => void) {
    this._ws = ws;
  }

  get config() {
    return this._config;
  }

  set config(config: any) {
    this._config = config;
  }
}
