import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Log } from '../classes/log';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  standalone: false
})
export class AnalyticsComponent {
  /** フォーム */
  public form!: FormGroup;
  /** 処理中か否か */
  public isProcessing: boolean = false;
  /** ログ行の配列 */
  public logs?: Array<Log & { isOpenedUa: boolean; }>;
  /** エラー */
  public error?: Error;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly analyticsService: AnalyticsService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    const jstNow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const year   = jstNow.getFullYear();
    const month  = ('0' + (jstNow.getMonth() + 1)).slice(-2);
    const date   = ('0' +  jstNow.getDate()      ).slice(-2);
    const nowYmd = `${year}-${month}-${date}`;
    this.form = this.formBuilder.group({
      id : [1],
      ymd: [nowYmd]
    });
    
    await this.onFind();  // 今日日付でとりあえずリクエストする
  }
  
  public async onFind(): Promise<void> {
    this.isProcessing = true;
    this.logs = undefined;
    this.error = undefined;
    try {
      const logsResult = await this.analyticsService.find(Number(this.form.value.id), this.form.value.ymd);
      this.logs = (logsResult.result as Array<Log & { isOpenedUa: boolean; }>).reverse().map(log => {  // 新しい日時が上に来るように `reverse()` する
        log.isOpenedUa = true;  // デフォルトは最大3行に閉じておきクリックで開閉できるフラグを付けておく
        return log;
      });
    }
    catch(error: any) {
      if(typeof error.error?.error?.code === 'string') this.error = `${error.error.error.code} (ファイルがないかも)` as unknown as Error;
      else if(typeof error.error?.error === 'string') this.error = error.error.error;
      else this.error = error;
    }
    finally {
      this.isProcessing = false;
    }
  }
  
  public replaceRefUrl(ref: string): string {
    return ref.replace('https://', '').replace((/^www\./), '').replace((/\/+$/), '');
  }
  
  public replaceTitle(title: string): string {
    return title.replace(' - Neo\'s World', '');
  }
  
  public replaceUrlShowParams(url: string): string {
    const match = url.match((/[?#].*/));
    return match == null ? '' : decodeURIComponent(match[0]);
  }
  
  public replaceQuotes(value: string): string {
    return value.replace((/^"/), '').replace((/"$/), '');
  }
}
