import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploaderService {
  private readonly fileDirectoryPath: string;
  
  constructor(
    private readonly configService: ConfigService
  ) {
    this.fileDirectoryPath = this.configService.get('fileDirectoryPath');
  }
  
  public async findAll(): Promise<Array<string>> {
    return await fs.readdir(this.fileDirectoryPath);
  }
  
  public async findOne(fileName: string): Promise<Buffer> {
    return await fs.readFile(path.resolve(this.fileDirectoryPath, fileName));
  }
  
  public async uploadFile(file: Express.Multer.File, fileName: string): Promise<boolean> {
    return await fs.writeFile(path.resolve(this.fileDirectoryPath, fileName), file.buffer).then(_result => true).catch(_error => false);
  }
  
  public async remove(fileName: string): Promise<boolean> {
    return await fs.unlink(path.resolve(this.fileDirectoryPath, fileName)).then(_result => true).catch(_error => false);
  }
}
