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
  private totalExpectedParts: number;
  private nextExpectedPart = 0;
  private queue: Map<number, Upload> = new Map();

  private fileName: string;
  private fileStream = new PassThrough();

  constructor(doc: Upload, private destination: UploadDestination) {
    // doc is the first piece of the file to be received
    // parts may arrive out of order, so this isn't guaranteed to be the first part of the file

    this.fileStream._read = () => {};

    this.fileName = doc.name;
    this.totalExpectedParts = doc.totalExpectedParts;

    this.destination.putStream(this.fileStream, doc.pathFromRoot, doc.name);

    this.addPart(doc);
  }

  get partsUpload() {
    return this.nextExpectedPart;
  }

  get partsRemaining() {
    return this.totalExpectedParts - this.partsUpload;
  }

  async addPart(doc: Upload) {
    this.queue.set(doc.part, doc);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    // check for next part in queue
    if (this.queue.has(this.nextExpectedPart)) {
      // next part exists in queue, append it to file
      this.appendToStream(this.queue.get(this.nextExpectedPart++));

      if (this.nextExpectedPart < this.totalExpectedParts) {
        this.processQueue();
      } else {
        console.log('Done uploading', this.fileName);
      }
    }

    // above check is not guaranteed. if the part doesn't exist in the queue,
    // this function will be a no-op as the next expected part hasn't yet arrived
  }

  private appendToStream(doc: Upload) {
    this.fileStream.push(doc.data);
  }
}

@Injectable()
export class Uploader {
  inFlight: Map<string, InFlightUpload> = new Map();

  constructor(private dest: UploadDestination) {}

  upload(doc: Upload) {
    if (this.inFlight.has(doc.fileId)) {
      this.inFlight.get(doc.fileId).addPart(doc);
    } else {
      this.inFlight.set(doc.fileId, new InFlightUpload(doc, this.dest));
    }
  }
}
