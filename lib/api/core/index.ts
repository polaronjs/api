import { Router } from 'express';
import * as WebSocket from 'ws';

export class ThrustrCore {
  private _router: Router;
  private _ws: (ws: WebSocket) => void;
  private _config: any;


  private static instance: ThrustrCore;

  private constructor() { }

  public static resolveInstance() {
    if (!this.instance) {
      this.instance = new ThrustrCore();
    }

    return this.instance;
  }


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