import { Injectable } from '@phantomcms/injector';
import { PassThrough } from 'stream';
import { UploadDestination } from './destinations';

export interface Upload {
  fileId: string;
  name: string;
  part: number;
  totalExpectedParts: number;
  data: Buffer;
  chunkSize: number;
  fileSize: number;
  pathFromRoot: string;
}

export class InFlightUpload {
  private totalExpectedParts!: number;
  private fileName: string;
  private fileStream = new PassThrough();

  constructor(doc: Upload, private destination: UploadDestination) {
    // doc is the first piece of the file to be received
    // parts may arrive out of order, so this isn't guaranteed to be the first part of the file

    this.fileStream._read = () => {};

    this.fileStream.on('end', () => {
      console.log('stream is done for ' + this.fileName);
    });
    this.fileStream.on('pause', (event) => {
      console.log('stream is paused for ' + this.fileName, event);
    });
    this.fileStream.on('resume', () => {
      console.log('stream is resumed for ' + this.fileName);
    });
    this.fileStream.on('finish', () => {
      console.log('stream is finished for ' + this.fileName);
    });
    this.fileStream.on('close', () => {
      console.log('stream is clothes for ' + this.fileName);
    });

    this.fileName = doc.name;
    this.totalExpectedParts = doc.totalExpectedParts;

    this.destination.putStream(this.fileStream, doc.pathFromRoot, doc.name);

    this.addPart(doc);
  }

  addPart(doc: Upload) {
    return this.appendToStream(doc).then(() => {});
  }

  private async appendToStream(doc: Upload) {
    return new Promise((resolve, reject) => {
      this.fileStream.once('pause', () => {
        if (doc.part === this.totalExpectedParts) {
          this.fileStream.end();
        }
        resolve();
      });
      this.fileStream.push(doc.data);
    });
  }
}

@Injectable()
export class Uploader {
  inFlight: Map<string, InFlightUpload> = new Map();

  constructor(private dest: UploadDestination) {}

  upload(doc: Upload) {
    if (this.inFlight.has(doc.fileId)) {
      return this.inFlight.get(doc.fileId).addPart(doc);
    } else {
      const upload = new InFlightUpload(doc, this.dest);
      this.inFlight.set(doc.fileId, upload);
      return upload.addPart(doc);
    }
  }
}
