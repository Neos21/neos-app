import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SolilogService {
  /** Solilog JSON ファイルのディレクトリ */
  private solilogDirectoryPath: string;
  
  constructor(
    private configService: ConfigService
  ) {
    this.solilogDirectoryPath = this.configService.get('solilogDirectoryPath');
  }
  
  public async getList(): Promise<Array<string>> {
    const fileNames = await fs.readdir(this.solilogDirectoryPath);
    const yearMonths = fileNames.map(fileName => fileName.match((/(\d{4}-\d{2})/u))?.[1]).sort().reverse();  // `YYYY-MM` のみにし新しい年月から並べる
    return yearMonths;
  }
  
  public async getPosts(yearMonth?: string): Promise<{ t: string, posts: Array<{ id: number; time: string; text: string; }>; } | null> {
    if(yearMonth == null || !(/^\d{4}-\d{2}$/u).test(yearMonth)) yearMonth = this.getCurrentYearMonth();  // `YYYY-MM` 形式でなければ現在年月とする
    const posts = await this.loadPostFile(yearMonth).catch(_error => null);  // `null` の場合は対象ファイルなし
    return { t: yearMonth, posts };
  }
  
  public async post(text: string): Promise<boolean> {
    text = text.trim();
    const currentYearMonth = this.getCurrentYearMonth();
    const posts = await this.loadPostFile(currentYearMonth).catch(_error => []);  // ファイルがない場合は空配列を用意する
    const currentId = posts[0]?.id ?? -1;  // `0` から始める
    const id = currentId + 1;
    const time = this.getCurrentTime();
    posts.unshift({ id, time, text });  // 先頭に付与する
    return await this.writePostFile(currentYearMonth, posts);
  }
  
  public async remove(yearMonth: string, id: number): Promise<boolean> {
    const posts = await this.loadPostFile(yearMonth).catch(_error => null);
    if(posts == null) return null;  // 対象ファイルなし
    const targetIndex = posts.findIndex(post => post.id === id);
    posts.splice(targetIndex, 1);  // 対象の投稿を削除する
    return await this.writePostFile(yearMonth, posts);
  }
  
  /** 日本時間で現時刻の `YYYY-MM` を取得する */
  private getCurrentYearMonth(): string {
    const jstNow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const year  = jstNow.getFullYear();
    const month = ('0' + (jstNow.getMonth() + 1)).slice(-2);
    return `${year}-${month}`;
  }
  
  private getCurrentTime(): string {
    const jstNow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const year    = jstNow.getFullYear();
    const month   = ('0' + (jstNow.getMonth() + 1)).slice(-2);
    const date    = ('0' +  jstNow.getDate()      ).slice(-2);
    const hours   = ('0' +  jstNow.getHours()     ).slice(-2);
    const minutes = ('0' +  jstNow.getMinutes()   ).slice(-2);
    const seconds = ('0' +  jstNow.getSeconds()   ).slice(-2);
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  }
  
  private async loadPostFile(yearMonth: string): Promise<Array<{ id: number; time: string; text: string; }>> {
    const file = await fs.readFile(path.resolve(this.solilogDirectoryPath, `solilog-${yearMonth}.json`), 'utf-8');  // Throws
    const json = JSON.parse(file);  // Throws
    return json;
  }
  
  private async writePostFile(yearMonth: string, posts: Array<{ id: number; time: string; text: string; }>): Promise<boolean> {
    const stringified = JSON.stringify(posts, null, '  ') + '\n';
    return await fs.writeFile(path.resolve(this.solilogDirectoryPath, `solilog-${yearMonth}.json`), stringified, 'utf-8').then(_result => true).catch(_error => false);  // ファイルのパーミッションに注意
  }
}
