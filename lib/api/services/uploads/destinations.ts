import { PassThrough } from 'stream';
import { Injector } from '@phantomcms/injector';
import * as Client from 'ssh2-sftp-client';
import { buildPath } from '../../helpers';
import { InternalError } from '../../errors';

export abstract class UploadDestination {
  abstract putStream(
    fileStream: PassThrough,
    pathFromRoot: string,
    fileName: string
  ): void;
}

export class SFTPUploadDestination extends UploadDestination {
  private connected: boolean;

  private sftp = new Client();

  constructor() {
    super();

    // TODO
    this.sftp
      .connect({
        host: process.env.FTP_HOST,
        port: parseInt(process.env.FTP_PORT) || 22,
        username: process.env.FTP_USERNAME,
        password: process.env.FTP_PASSWORD,
      })
      .then(() => {
        console.log('SFTP Connection Established');
        this.connected = true;
      })
      .catch(() => {
        console.log('Error! SFTP Connection COULD NOT be Established');
        this.connected = false;
      });
  }

  async putStream(
    fileStream: PassThrough,
    pathFromRoot: string,
    fileName: string
  ) {
    if (this.connected) {
      // verify that path is valid
      const pathToDestination = buildPath(
        process.env.FTP_PATH_PREFIX,
        pathFromRoot
      );
      const fullPath = buildPath(pathToDestination, fileName);

      if (!(await this.sftp.exists(pathToDestination))) {
        // we checked the remote path and some/all of it doesn't exist
        // need to create
        await this.buildPathAtRemote(pathToDestination);
      }

      this.sftp.put(fileStream, fullPath);
    }
  }

  private async buildPathAtRemote(fullPath: string): Promise<void> {
    const segments = fullPath.split('/');

    let testingPath = '/';
    while (segments.length) {
      testingPath += segments.splice(0, 1)[0] + '/';

      if (!testingPath) {
        continue;
      }

      const destinationType = await this.sftp.exists(testingPath);

      if (!destinationType) {
        await this.sftp.mkdir(testingPath);
      } else if (destinationType !== 'd') {
        throw new InternalError({
          message: `Path ${fullPath} is invalid, ${testingPath} exists and is not a directory`,
        });
      }
    }
  }
}

// default implementation
Injector.register(UploadDestination, { useClass: SFTPUploadDestination });
