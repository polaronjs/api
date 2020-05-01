import { Injectable } from '@phantomcms/injector';
import { Route, HttpMethod } from '../http/route';
import { Params, StatusCode } from '../http';
import { Uploader } from '../services/uploads';
import * as multer from 'multer';

const uploader = multer();

@Injectable()
export class FileComponent {
  constructor(private uploader: Uploader) {}

  @Route({
    method: HttpMethod.POST,
    route: '/files',
    middleware: [uploader.any()],
  })
  @Params('body', 'files')
  @StatusCode(201)
  uploadFilePart(doc: any, [{ buffer: data }]: [{ buffer: Buffer }]) {
    Object.assign(
      doc,
      { data },
      {
        part: parseInt(doc.part),
        totalExpectedParts: parseInt(doc.totalExpectedParts),
      }
    );
    this.uploader.upload(doc);
  }
}
