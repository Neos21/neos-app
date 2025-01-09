import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const execAsync = promisify(exec);

@Injectable()
export class MediaExplorerService {
  private readonly mediaDirectoryPath: string;
  
  constructor(
    private readonly configService: ConfigService
  ) {
    this.mediaDirectoryPath = this.configService.get('mediaDirectoryPath');
  }
  
  public async gitPull(): Promise<boolean> {
    try {
      await execAsync('git pull', {
        shell: '/bin/bash',
        cwd: this.mediaDirectoryPath
      });
      return true;
    }
    catch(_error) {
      return false;
    }
  }
  
  public async getNamesJson(jsonFileName: string): Promise<any | null> {
    try {
      const fileText = await fs.readFile(path.resolve(this.mediaDirectoryPath, 'public/names/', jsonFileName), 'utf-8');
      return JSON.parse(fileText);
    }
    catch(_error) {
      return null;
    }
  }
  
  public getThumbnail(year: string, ymdFileName: string): string {
    return path.resolve(this.mediaDirectoryPath, 'public/thumbnails/', year, ymdFileName);
  }
}
