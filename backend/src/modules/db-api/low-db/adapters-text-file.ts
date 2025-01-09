// https://github.com/typicode/lowdb/blob/1b004c8228029161a15b557ba0bb638eaad3fd4b/src/adapters/node/TextFile.ts
import { PathLike, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { Adapter, SyncAdapter } from './core-low';
import { Writer } from './steno';

export class TextFile implements Adapter<string> {
  #filename: PathLike;
  #writer: Writer;
  
  constructor(filename: PathLike) {
    this.#filename = filename;
    this.#writer = new Writer(filename);
  }
  
  public async read(): Promise<string | null> {
    try {
      const data = await readFile(this.#filename, 'utf-8');
      return data;
    }
    catch(error) {
      if((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }
  
  public write(str: string): Promise<void> {
    return this.#writer.write(str);
  }
}

export class TextFileSync implements SyncAdapter<string> {
  #tempFilename: PathLike;
  #filename: PathLike;
  
  constructor(filename: PathLike) {
    this.#filename = filename;
    const f = filename.toString();
    this.#tempFilename = path.join(path.dirname(f), `.${path.basename(f)}.tmp`);
  }
  
  public read(): string | null {
    try {
      const data = readFileSync(this.#filename, 'utf-8');
      return data;
    }
    catch(error) {
      if((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }
  
  public write(str: string): void {
    writeFileSync(this.#tempFilename, str);
    renameSync(this.#tempFilename, this.#filename);
  }
}
