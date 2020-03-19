
import { DataLayer } from '..';

// interfaces
import { DataSource, DataSourceToken } from '../DataSource';

// mongo
import { MongoClient, Db } from 'mongodb';

class MongoConnection {
  ready: boolean;
  db: Promise<Db>;

  private static instance: MongoConnection;

  private constructor() {
    this.db = new Promise((resolve, reject) => {
      MongoClient.connect(process.env.MONGO_CONNECTION_URL, { useUnifiedTopology: true }).then(client => {
        resolve(client.db('thrustr'));
        console.log('Mongo Connected');
      }).catch(error => {
        reject(error);
      })
    });
  }

  static resolve() {
    if (!this.instance) {
      this.instance = new MongoConnection();
    }

    return this.instance;
  }
}

export class MongoDatabase implements DataSource<any> {
  ready: Promise<void>;

  private db: Db;
  private path: string;

  constructor() {
    MongoConnection.resolve().db.then(db => {
      this.db = db;
    })
  }

  static use(path: string): DataSourceToken<any> {
    this.prototype.path = path;
    return this;
  }

  create(document: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  read({ query, options }: { query?: any; options?: any; }): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  update({ query, document }: { query: any; document: Partial<any>; }): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  delete(query: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}