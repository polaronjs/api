import { CreateableEntity, Repository } from '.';
import { Injectable } from '../../injector';
import { prop, index } from '@typegoose/typegoose';

@index({ name: 'text' })
export class Tag extends CreateableEntity {
  @prop({ required: true, unique: true })
  name: string;
}

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor() {
    super(Tag);
  }
}
