import { prop } from '@typegoose/typegoose';
import { Entity, Repository } from '.';
import { Injectable } from '../../injector';

export enum AccessLevel {
  USER,
  EDITOR,
  ADMIN,
  SUPER,
}

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

  findOneWithPassword(username: string): Promise<{ password: string }> {
    return this.model.findOne({ username }).select('+password').lean().exec();
  }
}
