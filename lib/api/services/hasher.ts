import * as bcrypt from 'bcrypt';
import { Injectable, Injector } from '../injector';

export abstract class Hasher {
  abstract hash(value: string): Promise<string>;
  abstract compare(value: string, hash: string): Promise<boolean>;
}

export class BcryptDriver implements Hasher {
  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, 10);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    if (await bcrypt.compare(value, hash)) {
      return true;
    }

    return false;
  }
}

Injector.register(Hasher, { useClass: BcryptDriver });
