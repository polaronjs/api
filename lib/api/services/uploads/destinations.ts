import { PassThrough } from 'stream';
import { Injector } from '@phantomcms/injector';
import * as Client from 'ssh2-sftp-client';
import { buildPath } from '../../helpers';
import { InternalError, PhantomError } from '../../errors';
import { operation } from 'retry';

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

  private constructor() {
    super();
  }

  async ConnectToServer(): Promise<SFTPUploadDestination> {
    const instance = new SFTPUploadDestination();

    let retryAttempts = 0;

    const connectionOperation = operation({
      retries: 2,
    });

    connectionOperation.attempt(async (retryAttempts) => {
      const error = await instance.connect();

      if (connectionOperation.retry(error)) {
        retryAttempts += 1;
        return;
      }
    });

    if (connectionOperation.mainError) {
      throw new InternalError({
        message: `Unable to establish connection to SPT server after ${retryAttempts} attempts`,
      });
    }

    return instance;
  }

  private async connect(): Promise<Error> {
    let errorResponse: Error;

    try {
      await this.sftp.connect({
        host: process.env.FTP_HOST,
        port: parseInt(process.env.FTP_PORT) || 22,
        username: process.env.FTP_USERNAME,
        password: process.env.FTP_PASSWORD,
      });

      console.log('SFTP Connection Established');
      this.connected = true;
    } catch (error) {
      console.log('Error! SFTP Connection COULD NOT be Established');
      this.connected = false;

      errorResponse = error;
    }

    return errorResponse;
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

  async deleteFile(filePath: string) {
    if (this.connected) {
      this.sftp.delete(filePath);
    }
  }

  async getFiles(filePaths: string[]): Promise<Buffer[]> {
    if (this.connected) {
      const fileStreams: Buffer[] = [];

      filePaths.map(async (filePath: string) => {
        if (this.sftp.exists(filePath)) {
          const fileStream = <Buffer>await this.sftp.get(filePath);

          fileStreams.push(fileStream);
        }
      });

      return fileStreams;
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
