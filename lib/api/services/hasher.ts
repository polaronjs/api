import * as bcrypt from 'bcrypt';
import { Injector, Injectable } from '../injector';

export interface Hasher {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}

@Injectable()
export class Hasher implements Hasher {
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
