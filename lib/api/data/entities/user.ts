import { UseDatabase } from '../../decorators/database';
import { MongoDatabase } from '../mongo';
import { DataSource } from '../DataSource';
import { Db } from 'mongodb';

export enum AccessLevel {
  USER = 'user',
  EDITOR = 'user',
  ADMIN = 'user',
  SUPER = 'user'
}

export interface User {
  id: any;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  AccessLevel: AccessLevel
  creationDate: Date;
  lastLogin?: Date;
}

@UseDatabase(MongoDatabase, 'users')
export class UserEntity {
  private db: DataSource<User>; // injected from UseDatabase

  constructor() { }

  createUser(document: User) {
    return this.db.create(document);
  }


}
