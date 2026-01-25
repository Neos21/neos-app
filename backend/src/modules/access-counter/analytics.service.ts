import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnalyticsService {
  private readonly pvDirectoryPath: string;
  
  constructor(private readonly configService: ConfigService) {
    this.pvDirectoryPath = this.configService.get('pvDirectoryPath');
  }
  
  public async getLogs(id: number, ymd: string): Promise<Array<any>> {  // Throws
    const yearMonth = ymd.slice(0, 7);  // `YYYY-MM`
    const fileName = `${id}-${yearMonth}.jsonl`;
    const stream = fs.createReadStream(path.resolve(this.pvDirectoryPath, fileName), { encoding: 'utf-8' });
    const readLineInterface = readline.createInterface({ input: stream });
    
    // ログファイルは古い日時から新しい日時へと追記しているので、この範囲内の行だけ読み込めば良い
    const start = `${ymd} 00:00:00`;
    const end   = `${ymd} 23:59:59`;
    
    const logs = [];
    for await(const line of readLineInterface) {
      if(!line) continue;  // 空行はスキップする
      
      const match = line.match((/"jst"\s*:\s*"([^"]+)"/));  // 間のスペースの有無に関わらず `"jst": "VALUE"` の `VALUE` 部分を取得する
      if(!match) continue;
      const jst = match[1];
      
      if(jst < start) continue;  // その行の日時が指定の日付以前ならスキップする
      if(jst > end) {  // その行の日時が指定の日付以降 (翌日) に達したらファイルの読み込みを終える
        readLineInterface.close();
        stream.close();
        break;  // Close 処理は書かなくても自動的に行われるものの非同期になるため明示的に行っておく方が安全
      }
      
      logs.push(JSON.parse(line));
    }
    return logs;
  }
}
