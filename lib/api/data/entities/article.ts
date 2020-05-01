import { CreateableEntity, Repository } from '.';
import { Category } from './category';
import { prop, Ref, index } from '@typegoose/typegoose';
import { Injectable } from '@phantomcms/injector';

@index({ title: 'text', body: 'text' })
export class Article extends CreateableEntity {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  body: string;

  @prop({ required: true, ref: Category })
  cagegory: Ref<Category>;
}

@Injectable()
export class ArticleRepository extends Repository<Article> {
  constructor() {
    super(Article);
  }

  findByCategoryName(names: string[]): Promise<Article[]> {
    return this.find();
  }
}
