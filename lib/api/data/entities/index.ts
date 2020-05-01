import {
  prop,
  Ref,
  getModelForClass,
  modelOptions,
} from '@typegoose/typegoose';
import { User } from './user';
import { Model } from '..';
import { PhantomQuery } from '../../http/query';
import { InternalError, NotFoundError } from '../../errors';

export class Entity {
  id: any;

  static from<T>(data: any): T {
    const entity = new Entity();

    if (data._id) {
      entity.id = data._id;
      delete data._id;
    }

    // delete the mongoose __version prop
    delete data.__v;

    // for all other properties, set them on the entity
    for (let [key, value] of Object.entries(data)) {
      if (typeof value['__v'] !== 'undefined') {
        // recursively convert child entities
        value = Entity.from(value);
      }

      entity[key] = value;
    }

    return (entity as unknown) as T;
  }
}

@modelOptions({
  schemaOptions: {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  },
})
export class CreateableEntity extends Entity {
  createdDate: Date;

  @prop({ required: true, ref: 'User' })
  createdBy: Ref<User>;

  lastUpdatedDate?: Date;

  @prop({ ref: 'User' })
  lastUpdatedBy?: Ref<User>;
}

export abstract class Repository<T> {
  protected model: Model<T>;

  constructor(entity: new () => T) {
    this.model = getModelForClass(entity);
  }

  async create(document: Partial<T>, requester?: User): Promise<T> {
    if (!requester && this.model.schema.paths.createdBy) {
      throw new InternalError({
        message: 'Requester not specified for creation',
      });
    } else if (this.model.schema.paths.createdBy) {
      document['createdBy'] = requester.id;
      document['lastUpdatedBy'] = requester.id;
    }

    const result = await this.model.create(document);
    return this.model.findById(result._id).then((value) => {
      return Entity.from(value.toObject());
    });
  }

  async findOne(id: string): Promise<T> {
    try {
      const value = await this.model
        .findById(id)
        .populate('createdBy')
        .populate('lastUpdatedBy')
        .exec();

      return Entity.from(value.toObject());
    } catch (_) {
      throw new NotFoundError();
    }
  }

  find(options?: PhantomQuery<T>): Promise<T[]> {
    const { query, sorting, pagination } = options || {};
    let request = this.model.find(query);

    if (
      query &&
      Object.keys(query).length === 1 &&
      query.hasOwnProperty('search')
    ) {
      // @ts-ignore TODO investigate/raise issue with Typegoose about typings here
      request = this.model.find({
        $text: { $search: '"' + query.search + '"', $caseSensitive: false },
      });
    }

    if (pagination) {
      if (pagination.offset) {
        request.skip(pagination.offset);
      }

      if (pagination.limit) {
        request.limit(pagination.limit);
      }
    }

    if (sorting) {
      request.sort({ [sorting.property]: sorting.direction || -1 });
    }

    return request
      .populate('createdBy')
      .populate('updatedBy')
      .lean<T>()
      .exec()
      .then((values) => {
        return values.map((value) => Entity.from(value));
      });
  }

  async update(id: string, updates: any, requester?: User): Promise<T> {
    if (!requester && this.model.schema.paths.lastUpdatedBy) {
      throw new InternalError({
        message: 'Requester not specified for updating',
      });
    } else if (this.model.schema.paths.lastUpdatedBy) {
      document['lastUpdatedBy'] = requester.id;
    }

    await this.model.findByIdAndUpdate(id, updates).lean<T>().exec();
    return this.findOne(id).then((value) => {
      return Entity.from(value);
    });
  }

  delete(id: string): Promise<T> {
    return this.model
      .findByIdAndDelete(id)
      .lean<T>()
      .exec()
      .then((value) => {
        return Entity.from(value);
      });
  }
}
