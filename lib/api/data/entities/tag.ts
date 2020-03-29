import { CreateableEntity, Repository } from '.';
import { Injectable } from '../../injector';
import { prop } from '@typegoose/typegoose';

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
