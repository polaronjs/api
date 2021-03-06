import { prop, index } from '@typegoose/typegoose';
import { Entity, Repository } from '.';
import { Injectable } from '@phantomcms/injector';

export enum AccessLevel {
  USER = 0,
  EDITOR = 1,
  ADMIN = 2,
  SUPER = 3,
}

@index({ name: 'text', email: 'text' })
export class User extends Entity {
  @prop({ required: true, unique: true })
  username: string;

  @prop({ select: false })
  password: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true, default: AccessLevel.USER })
  accessLevel: AccessLevel;

  @prop()
  lastLogin?: Date;

  @prop()
  image?: string;
}

export interface UserQuery {
  name: string;
  username: string;
  email: string;
}

@Injectable()
export class UserRepository extends Repository<User> {
  constructor() {
    super(User);
  }

  findOneByProperty(query: UserQuery): Promise<User[]> {
    return this.find({ query, pagination: { limit: 1 } });
  }

  findOneWithPassword(username: string): Promise<User> {
    return this.model
      .findOne({ username })
      .select('+password')
      .lean<User>()
      .exec()
      .then((value) => {
        return value ? Entity.from<User>(value) : undefined;
      });
  }
}
