import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../shared/services/auth.service';
import { SolilogService } from '../services/solilog.service';

@Component({
  selector: 'app-solilog',
  templateUrl: './solilog.component.html',
  styleUrls: ['./solilog.component.css']
})
export class SolilogComponent implements OnInit, AfterViewInit {
  /** フォーム */
  public form!: FormGroup;
  /** 処理中かどうか */
  public isProcessing: boolean = false;
  /** 投稿時エラー */
  public error?: Error | string;
  
  /** Posts の内容を読込中かどうか */
  public isLoadingPosts: boolean = true;
  /** Posts 取得時エラー時 */
  public postsError?: Error | string;
  /** 年月 */
  public yearMonth: string = '';
  /** Posts */
  public posts?: Array<{ id: number; time: string; text: string; }>;
  
  /** Archives の内容を読込中かどうか */
  public isLoadingList: boolean = true;
  /** Archives リストエラー時 */
  public listError?: Error | string;
  /** Archives リスト */
  public list?: Array<{ year: string; months: Array<string>; }>;
  
  /** クエリパラメータの購読 */
  private queryParamMap$!: Subscription;
  /** フラグメントの購読 */
  private fragment$!: Subscription;
  /** フラグメント */
  private fragment?: string;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private solilogService: SolilogService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.form = this.formBuilder.group({ text: ['', [Validators.required]] });
    this.queryParamMap$ = this.activatedRoute.queryParamMap.subscribe(async params => {
      const yearMonth = params.get('t')!;
      await this.loadPosts(yearMonth);
      this.ngAfterViewInit();  // フラグメントがあった場合にポスト読み込み後に遷移する
    });
    this.fragment$ = this.activatedRoute.fragment.subscribe(fragment => {
      this.fragment = fragment!;
    })
    await this.loadArchivesList();
  }
  
  public ngAfterViewInit(): void {
    window.setTimeout(() => {
      try {
        (document.getElementById(this.fragment!) as any).scrollIntoView();
      }
      catch(_error) { /* Do Nothing */ }
    }, 1);
  }
  
  public ngOnDestroy(): void {
    this.queryParamMap$.unsubscribe();
    this.fragment$.unsubscribe();
  }
  
  public async moveToCurrentYearMonth(): Promise<void> {
    await this.loadPosts(null);
  }
  
  public async loadPosts(yearMonth: string | null): Promise<void> {
    this.isLoadingPosts = true;
    this.yearMonth = '';
    this.posts = undefined;
    this.postsError = undefined;
    try {
      const result = await this.solilogService.getPosts(yearMonth);
      this.posts = result.posts;
      this.yearMonth = result.t;
    }
    catch(error: any) {
      this.postsError = error;
    }
    finally {
      this.isLoadingPosts = false;
    }
  }
  
  public async loadArchivesList(): Promise<void> {
    this.isLoadingList = true;
    this.list = undefined;
    this.listError = undefined;
    try {
      this.list = await this.solilogService.getList();
    }
    catch(error: any) {
      this.listError = error;
    }
    finally {
      this.isLoadingList = false;
    }
  }
  
  public isLoggedIn(): boolean {
    return this.authService.accessToken != null;
  }
  
  public async post(): Promise<void> {
    const text = this.form.value.text.trim();
    if(text === '') return;
    this.error = undefined;
    this.isProcessing = true;
    try {
      await this.solilogService.post(text);
      this.form.reset();
      await this.moveToCurrentYearMonth();
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.isProcessing = false;
    }
  }
  
  public async remove(yearMonth: string, id: number): Promise<void> {
    this.error = undefined;
    this.isProcessing = true;
    try {
      await this.solilogService.remove(yearMonth, id);
      await this.loadPosts(yearMonth);
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.isProcessing = false;
    }
  }
}
