import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Dictionary } from '../../entities/dictionaries/dictionary';

const execAsync = promisify(exec);

@Injectable()
export class MediaExplorerService {
  private readonly logger: Logger = new Logger(MediaExplorerService.name);
  private readonly mediaDirectoryPath: string;
  
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Dictionary) private readonly dictionariesRepository: Repository<Dictionary>
  ) {
    this.mediaDirectoryPath = this.configService.get('mediaDirectoryPath');
  }
  
  /** 辞書レコードが存在しなかったら作る */
  public async onModuleInit(): Promise<void> {
    const countAll = await this.dictionariesRepository.count();
    if(countAll === 0) {
      this.logger.warn('#onModuleInit() : Create Dictionary For First Time');
      await this.dictionariesRepository.insert({ id: 1, text: '' });
    }
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
  
  public async getDictionary(): Promise<Dictionary | null> {
    return await this.dictionariesRepository.findOneBy({ id: 1 }).catch(_error => null);
  }
  
  public async saveDictionary(text: string): Promise<Dictionary | null> {
    return await this.dictionariesRepository.save(new Dictionary({ id: 1, text })).catch(_error => null);
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
