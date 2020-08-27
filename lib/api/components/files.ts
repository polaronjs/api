import { Injectable } from '@phantomcms/injector';
import { Route, HttpMethod } from '../http/route';
import { Params, StatusCode } from '../http';
import { Uploader, Upload } from '../services/uploads';
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
    const upload = convertToUpload(doc, data);
    return this.uploader.upload(upload);
  }
}

function convertToUpload(doc: any, data: Buffer): Upload {
  return Object.assign(
    {},
    doc,
    { data },
    {
      part: parseInt(doc.part),
      totalExpectedParts: parseInt(doc.totalExpectedParts),
    }
  );
}
