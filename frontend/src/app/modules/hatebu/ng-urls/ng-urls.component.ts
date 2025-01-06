import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { NgUrl } from '../classes/ng-url';
import { NgUrlsService } from '../services/ng-urls.service';
import { PageTitleService } from '../services/page-title.service';

@Component({
  selector: 'app-ng-urls',
  templateUrl: './ng-urls.component.html',
  styleUrls: ['./ng-urls.component.css'],
  standalone: false
})
export class NgUrlsComponent implements OnInit, OnDestroy {
  /** ページデータの状態管理オブジェクト */
  private dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string }>({ isLoading: true });
  /** ローディング中か否か */
  public isLoading$  = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public error$      = this.dataState$.pipe(map(dataState => dataState.error));
  /** NG URL 一覧 */
  public ngUrls: Array<NgUrl> = [];
  /** 全件を表示するか否か (`true` で全件表示・`false` で省略表示) */
  public isShownAll = false;
  
  constructor(
    private ngUrlsService: NgUrlsService,
    private pageTitleService: PageTitleService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.pageTitleService.setPageTitle('NG URL 確認');
    try {
      await this.show();  // 初期表示
      this.dataState$.next({ isLoading: false });
    }
    catch(error: any) {
      this.dataState$.next({ isLoading: false, error });
    }
  }
  
  public ngOnDestroy(): void {
    this.dataState$.unsubscribe();
  }
  
  /** NG URL の全件表示・省略表示を切り替える */
  public async toggleShow(): Promise<void> {
    this.isShownAll = !this.isShownAll;
    await this.show();
  }
  
  public async reloadAll(): Promise<void> {
    this.dataState$.next({ isLoading: true });
    try {
      await this.ngUrlsService.findAll(true);
      await this.show();
      this.dataState$.next({ isLoading: false });
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  private async show(): Promise<void> {
    const ngUrls = await this.ngUrlsService.findAll();
    if(this.isShownAll) {
      this.ngUrls = ngUrls;
    }
    else {
      this.ngUrls = ngUrls.slice(0, 50);  // 50件までに省略表示する
    }
  }
}
