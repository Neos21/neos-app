import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PageTitleService {
  /** ページタイトル : 空白時の初期値は `HatebuComponent` にて処理する */
  public pageTitle$ = new BehaviorSubject<string>('');
  
  public setPageTitle(pageTitle: string = ''): void {
    window.setTimeout(() => {  // `ExpressionChangedAfterItHasBeenCheckedError` 対策
      this.pageTitle$.next(pageTitle);
    }, 0);
  }
}
