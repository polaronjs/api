import { Repository } from '.';
import { Injectable } from 'lib/api/injector';
import { prop } from '@typegoose/typegoose';
import { FileEntity } from './file';

export class Upload extends FileEntity {
  @prop({ required: true })
  totalParts: number;

  @prop({ required: true })
  partsUploaded: number;

  @prop({ required: true })
  startedDate: Date;
}

@Injectable()
export class UploadRepository extends Repository<Upload> {
  constructor() {
    super(Upload);
  }
}
