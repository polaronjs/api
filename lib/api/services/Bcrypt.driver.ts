// import * as bcrypt from 'bcrypt';

// // types
// import { Hasher } from '.';

// export class BcryptDriver implements Hasher {
//   async hash(value: string): Promise<string> {
//     return await bcrypt.hash(value, 10);
//   }
  
//   async compare(value: string, hash: string): Promise<boolean> {
//     if (await bcrypt.compare(value, hash)) {
//       return true;
//     }
  
//     return false;
//   }
// }