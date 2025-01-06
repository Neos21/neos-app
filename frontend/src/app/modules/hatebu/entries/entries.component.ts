import { Component } from '@angular/core';
import { BehaviorSubject, Subscription, map } from 'rxjs';

import { Category } from '../classes/category';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { PageTitleService } from '../services/page-title.service';
import { NgUrl } from '../classes/ng-url';
import { Entry } from '../classes/entry';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent {
  /** ページデータの状態管理オブジェクト */
  private dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string }>({ isLoading: true });
  /** ローディング中か否か */
  public isLoading$  = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public error$      = this.dataState$.pipe(map(dataState => dataState.error));
  /** クエリパラメータの購読 */
  private queryParamMap$!: Subscription;
  
  /** カテゴリ */
  public category?: Category;
  /** クエリパラメータのキー名 */
  private queryParamKey = 'category_id';
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private pageTitleService: PageTitleService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.queryParamMap$ = this.activatedRoute.queryParamMap.subscribe(params => {
      const categoryId = params.get(this.queryParamKey);
      if(categoryId == null) return this.moveFirst();
      return this.show(Number(categoryId));
    });
  }
  
  /** コンポーネント破棄時 */
  public ngOnDestroy(): void {
    this.dataState$.unsubscribe();
    this.queryParamMap$.unsubscribe();
  }
  
  /** 指定のカテゴリ情報を取得し表示する */
  public async show(categoryId: number): Promise<void> {
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      const { categories, ngUrls, ngWords, ngDomains } = await this.apiService.fetchAll();  // フィルタに使用する NG 情報も確実に取得しておく
      const category = categories.find(category => category.id === categoryId);
      if(category == null) throw new Error('The Category Does Not Exist');
      
      // NG 情報のフィルタ処理
      category.entries = category.entries.filter(entry => {
        // NG ドメイン : NG ドメインは登録時に小文字に統一しているので、小文字に変換して確認する
        const lowerUrl = entry.url.toLowerCase();
        if(ngDomains.some(ngDomain => lowerUrl.includes(ngDomain.domain))) return false;
        // NG ワード : タイトルと本文を対象に曖昧一致で除外する
        const fuzzyWord = this.apiService.ngWords.transformText(`${entry.title} ${entry.description}`);
        if(ngWords.some(ngWord => fuzzyWord.includes(this.apiService.ngWords.transformText(ngWord.word)))) return false;
        // NG URL : 記事データを複製する形で NG URL を登録しているので、完全一致で良い
        if(ngUrls.some(ngUrl => entry.url === ngUrl.url)) return false;
        // いずれにも一致しなかったら残す
        return true;
      });
      
      this.category = category;
      this.pageTitleService.setPageTitle(category.name);
      this.dataState$.next({ isLoading: false });
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  /**
   * 「削除する」ボタン押下時：選択された記事を NG URL に追加して削除する
   * 
   * @param viewIndex 表示中の添字 (`this.category.entries` の添字)
   * @param entry 削除する記事
   */
  public async removeEntry(viewIndex: number, entry: Entry): Promise<void> {
    try {
      // 先に表示上の記事を削除する
      this.category!.entries.splice(viewIndex, 1);
      // API コールして NG URL を追加する
      const ngUrl = new NgUrl({
        title       : entry.title,
        url         : entry.url,
        description : entry.description,
        count       : entry.count,
        date        : entry.date,
        faviconUrl  : entry.faviconUrl,
        thumbnailUrl: entry.thumbnailUrl
      });
      await this.apiService.ngUrls.create(ngUrl);
      try {
        (window.document.activeElement as any).blur();
      }
      catch(_blurError) { /* Do Nothing */ }
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  public async reloadAll(currentCategoryId: number): Promise<void> {
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      await this.apiService.categories.findAll(true);
      await this.show(currentCategoryId);
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  public async reloadById(currentCategoryId: number): Promise<void> {
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      await this.apiService.categories.findById(currentCategoryId, true);
      await this.show(currentCategoryId);
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  public async scrapeAll(currentCategoryId: number): Promise<void> {
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      await this.apiService.categories.scrapeAll();
      await this.show(currentCategoryId);
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  public async scrapeById(currentCategoryId: number): Promise<void> {
    this.dataState$.next({ isLoading: true });
    this.category = undefined;
    try {
      await this.apiService.categories.scrapeById(currentCategoryId);
      await this.show(currentCategoryId);
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  public async moveNext(currentCategoryId: number): Promise<void> {
    const categories = await this.apiService.categories.findAll();
    const currentCategoryIndex = categories.findIndex(category => category.id === currentCategoryId);
    const nextCategory = categories[currentCategoryIndex + 1];
    this.movePage(nextCategory == null ? categories[0].id : nextCategory.id);  // 一つ後がなければ最初のカテゴリに移動する
  }
  
  public async movePrev(currentCategoryId: number): Promise<void> {
    const categories = await this.apiService.categories.findAll();
    const currentCategoryIndex = categories.findIndex(category => category.id === currentCategoryId);
    const prevCategory = categories[currentCategoryIndex - 1];
    this.movePage(prevCategory == null ? categories[categories.length - 1].id : prevCategory.id);  // 一つ前がなければ最後のカテゴリに移動する
  }
  
  private async moveFirst(): Promise<void> {
    const categories = await this.apiService.categories.findAll();
    const firstCategoryId = categories[0].id;
    this.movePage(firstCategoryId);
  }
  
  private movePage(categoryId: number): void {
    this.dataState$.next({ isLoading: true });  // 画面遷移に向けてローディング状態に変えておく
    this.category = undefined;
    this.router.navigate(['/hatebu/index'], { queryParams: { [this.queryParamKey]: categoryId }});
  }
}
