import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, map } from 'rxjs';

import { NgWord } from '../classes/ng-word';
import { NgWordsService } from '../services/ng-words.service';
import { PageTitleService } from '../services/page-title.service';

/** NG ワード管理ページ */
@Component({
  selector: 'app-ng-words',
  templateUrl: './ng-words.component.html',
  styleUrls: ['./ng-words.component.css'],
  standalone: false
})
export class NgWordsComponent implements OnInit, OnDestroy {
  /** 登録フォーム */
  public form!: FormGroup;
  /** ページデータの状態管理オブジェクト */
  private dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string }>({ isLoading: true });
  /** ローディング中か否か */
  public isLoading$  = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public error$      = this.dataState$.pipe(map(dataState => dataState.error));
  /** NG ワード一覧 */
  public ngWords$    = this.ngWordsService.ngWords$;
  
  constructor(
    private formBuilder: FormBuilder,
    private ngWordsService: NgWordsService,
    private pageTitleService: PageTitleService,
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.form = this.formBuilder.group({
      word: ['', [Validators.required]]
    });
    this.pageTitleService.setPageTitle('NG ワード管理');
    
    try {
      await this.ngWordsService.findAll();
      this.dataState$.next({ isLoading: false });
    }
    catch(error: any) {
      this.dataState$.next({ isLoading: false, error });
    }
  }
  
  public ngOnDestroy(): void {
    this.dataState$.unsubscribe();
  }
  
  public async create(): Promise<void> {
    if(this.form.value.word == null || this.form.value.word.trim() === '') return;  // iOS で空登録ができてしまうバグ回避
    this.dataState$.next({});  // Clear Error
    try {
      const word = `${this.form.value.word}`.trim();
      
      // NOTE : 登録データは重複がないように曖昧一致で確認する
      const fuzzyWord = this.ngWordsService.transformText(word);
      if(this.ngWords$.getValue()!.some(ngWord => this.ngWordsService.transformText(ngWord.word) === fuzzyWord)) {
        this.dataState$.next({ error: `${word} は登録済です。` });
        return this.form.reset();
      }
      
      await this.ngWordsService.create(new NgWord({ word }));
      this.form.reset();
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  public async remove(id: number): Promise<void> {
    this.dataState$.next({});  // Clear Error
    try {
      await this.ngWordsService.remove(id);
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  public async reloadAll(): Promise<void> {
    this.dataState$.next({ isLoading: true });
    try {
      await this.ngWordsService.findAll(true);
      this.dataState$.next({ isLoading: false });
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
}
