import * as mongoose from 'mongoose';
import { DATASOURCE_CONNECTED } from '../messages';
import { ReturnModelType } from '@typegoose/typegoose';

export function connect() {
  return mongoose
    .connect(process.env.MONGO_CONNECTION_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      dbName: 'phantom',
      useCreateIndex: true,
    })
    .then(() => {
      DATASOURCE_CONNECTED('Mongo');
    });
}

export type Model<T> = ReturnModelType<new (...args: any) => T, T>;
