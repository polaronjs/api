import { prop, index } from '@typegoose/typegoose';
import { Injectable } from '@phantomcms/injector';
import { CreateableEntity, Repository } from '.';

@index({ name: 'text' })
export class FileEntity extends CreateableEntity {
  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true })
  relativePath: string;

  @prop({ required: true })
  fileType: string;

  @prop({ required: true })
  baseUrl: string;

  get fullPath(): string {
    return (
      this.baseUrl +
      (this.baseUrl.charAt(this.baseUrl.length - 1) !== '/' ? '/' : '') +
      this.relativePath
    );
  }
}

@Injectable()
export class FileRepository extends Repository<FileEntity> {
  constructor() {
    super(FileEntity);
  }
}
