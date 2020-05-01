import { CreateableEntity, Repository } from '.';
import { prop, index } from '@typegoose/typegoose';
import { Injectable } from '@phantomcms/injector';

@index({ name: 'text', description: 'text' })
export class Category extends CreateableEntity {
  @prop({ required: true, unique: true })
  name: string;

  @prop({ text: true })
  description?: string;
}

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor() {
    super(Category);
  }
}
