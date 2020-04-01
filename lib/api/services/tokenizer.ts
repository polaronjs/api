import * as jwt from 'jsonwebtoken';
import { Injector } from '../injector';

export abstract class Tokenizer {
  abstract sign<T>(data: T, options?: any): string;
  abstract decode<T>(token: string): T;
}

export class JWTDriver implements Tokenizer {
  sign(data: any, options?: any) {
    return jwt.sign(data, process.env.SECRET, options || undefined);
  }

  decode(token: string) {
    return jwt.decode(token);
  }
}

Injector.register(Tokenizer, { useClass: JWTDriver });
