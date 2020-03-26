import { CreateableEntity, Repository } from '.';
import { prop } from '@typegoose/typegoose';
import { Injectable } from '../../injector';

export class Category extends CreateableEntity {
  @prop({ required: true, unique: true })
  name: string;

  @prop()
  description?: string;
}

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor() {
    super(Category);
  }
}
