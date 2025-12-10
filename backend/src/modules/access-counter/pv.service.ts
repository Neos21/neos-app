import { promises as fs } from 'node:fs';
import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Pv } from './classes/pv';

@Injectable()
export class PvService {
  private readonly pvDirectoryPath: string;
  
  constructor(private readonly configService: ConfigService) {
    this.pvDirectoryPath = this.configService.get('pvDirectoryPath');
  }
  
  public async savePv(pv: Pv, headers: Headers, ip: string): Promise<boolean> {
    try {
      const id = pv.id;  // 消した後に使用するので控えておく
      delete pv.id;
      const jstNow = this.getJstNow();
      const pvToSave = this.extractValues(pv, headers, ip, jstNow.dateTime);
      const jsonLine = this.createJsonLine(pvToSave);
      
      // `fs.appendFile()` はファイルがなければ新規作成して追記モードで書き込む
      const fileName = `${id}-${jstNow.yearMonth}.jsonl`;
      await fs.appendFile(path.resolve(this.pvDirectoryPath, fileName), jsonLine + '\n', 'utf-8');
      return true;
    }
    catch(_error) {
      return false;
    }
  }
  
  private getJstNow(): { dateTime: string; yearMonth: string; } {
    const jstNow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const year    = jstNow.getFullYear();
    const month   = ('0' + (jstNow.getMonth() + 1)).slice(-2);
    const date    = ('0' +  jstNow.getDate()      ).slice(-2);
    const hours   = ('0' +  jstNow.getHours()     ).slice(-2);
    const minutes = ('0' +  jstNow.getMinutes()   ).slice(-2);
    const seconds = ('0' +  jstNow.getSeconds()   ).slice(-2);
    return {
      dateTime : `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`,
      yearMonth: `${year}-${month}`
    }
  }
  
  private extractValues(pv: Pv, headers: Headers, ip: string, jst: string): Pv {
    // クライアントサイドから送られてくるはずの値がなかった場合はサーバサイドで設定したことを示すため `_` を入れる
    if(this.isEmpty(pv.ref  )) pv.ref   = '_';
    if(this.isEmpty(pv.url  )) pv.url   = '_';
    if(this.isEmpty(pv.title)) pv.title = '_';
    if(!Array.isArray(pv.langs) || pv.langs.length === 0) pv.langs = ['_'];
    if(this.isEmpty(pv.lang)) pv.lang = '_';
    if(this.isEmpty(pv.ua  )) pv.ua   = '_';
    if(!this.isObject(pv.ua_data) && pv.ua_data !== '-') pv.ua_data = '_';
    if(this.isEmpty(pv.ua_model)) pv.ua_model = '_';
    
    // `get()` がなく全て小文字のオブジェクトになっている模様
    pv.header_lang  = headers['accept-language'] ?? '_';
    pv.header_ua    = headers['user-agent'] ?? '_';
    pv.header_ch_ua = headers['sec-ch-ua'] ?? '_';
    const rawChUaMobile = headers['sec-ch-ua-mobile'];
    pv.header_ch_ua_mobile = rawChUaMobile === '?0' ? false
                           : rawChUaMobile === '?1' ? true
                           : '_';
    pv.header_ch_ua_platform = headers['sec-ch-ua-platform'] ?? '_';
    
    // IP アドレスと取得元ヘッダ情報
    const extractedIp = this.extractIp(headers, ip);
    pv.ip      = extractedIp.ip;
    pv.ip_from = extractedIp.from;
    
    // 必ず日本時間の `YYYY-MM-DD HH:mm:SS`
    pv.jst = jst;
    
    return pv;
  }
  
  private isEmpty(value: any): boolean {
    return value == null || String(value).trim() === '';
  }
  
  private isObject(item: any): boolean {
    return item != null && item?.constructor?.name === 'Object';  // `typeof item === 'object'` でも問題はなさそう
  }
  
  private extractIp(headers: Headers, ip: string): { ip: string; from: string; } {
    const xForwardedFor = headers['x-forwarded-for'];
    if(!this.isEmpty(xForwardedFor)) return { ip: xForwardedFor.split(',')[0].trim(), from: 'x-forwarded-for' };
    
    const forwarded = headers['forwarded'];
    if(!this.isEmpty(forwarded)) {
      const firstEntry = forwarded.split(',')[0];  // 複数ある場合があるので最初を確実に抽出する
      // セミコロンで分割して各ディレクティブをチェックする
      const directives = firstEntry.split(';');
      for(const directive of directives) {
        if(directive.toLowerCase().startsWith('for=')) {
          // `for=` の後の部分を取得し、二重引用符があれば削除して返す
          let extractedIp = directive.substring(4).trim();
          if(extractedIp.startsWith('"') && extractedIp.endsWith('"')) extractedIp = extractedIp.substring(1, extractedIp.length - 1).trim();
          return { ip: extractedIp, from: 'forwarded' };
        }
      }
    }
    
    const xRealIp = headers['x-real-ip'];  // 主に nginx で使用される
    if(!this.isEmpty(xRealIp)) return { ip: xRealIp.trim(), from: 'x-real-ip' };
    
    // その他参照すると良いかもしれないヘッダ : https://github.com/supercharge/request-ip/blob/main/src/request.ts
    // 1. true-client-ip      : Cloudflare・Akamai などで使用
    // 2. cf-connecting-ip    : Cloudflare で使用
    // 3. x-cluster-client-ip : AWS ELB などで使用
    // 4. x-client-ip         : EC2 などで使用
    // 現状特に間に何も挟まっていないので nginx の設定だけ考慮して設定しておく
    
    // 最終手段
    if(!this.isEmpty(ip)) return { ip: ip.trim(), from: 'req.ip' };
    // もし何も拾えなかったらコレ
    return { ip: '_', from: '_ (NOT FOUND)' };
  }
  
  private createJsonLine(pv: Pv): string {
    const orderedKeysReplacer = (_key, value) => {
      // 最上位のオブジェクトまたはネストされたオブジェクトの場合
      if(typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const orderedObject = {};
        
        // 望ましいキーの順序を指定しそのとおりに入れていく
        const desiredOrderKeys = [
          'id', 'jst', 'ref', 'url', 'title', 'ip', 'ip_from',
          'lang', 'langs', 'header_lang',
          'ua', 'header_ua',
          'ua_data', 'header_ch_ua', 'header_ch_ua_mobile', 'header_ch_ua_platform',
          'ua_model'
        ];
        desiredOrderKeys.forEach(desiredOrderKey => {
          if(value.hasOwnProperty(desiredOrderKey)) orderedObject[desiredOrderKey] = value[desiredOrderKey];
        });
        
        // 順序リストにないその他のキーはアルファベット順に追加する
        Object.keys(value).sort().forEach(objectKey => {
          if(!orderedObject.hasOwnProperty(objectKey)) orderedObject[objectKey] = value[objectKey];
        });
        
        return orderedObject;
      }
      // オブジェクト以外の値はそのまま返す
      return value;
    };
    
    // Key Value 間にスペースを入れた単一行の JSON 文字列を作成する
    return JSON.stringify(pv, orderedKeysReplacer, ' ').replace((/\n/g), ' ').replace((/\s\s+/g), ' ');
  }
}
