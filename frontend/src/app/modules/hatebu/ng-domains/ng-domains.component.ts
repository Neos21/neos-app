import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, map } from 'rxjs';

import { NgDomain } from '../classes/ng-domain';
import { NgDomainsService } from '../services/ng-domains.service';
import { PageTitleService } from '../services/page-title.service';

@Component({
  selector: 'app-ng-domains',
  templateUrl: './ng-domains.component.html',
  styleUrls: ['./ng-domains.component.css'],
  standalone: false
})
export class NgDomainsComponent implements OnInit, OnDestroy {
  /** 登録フォーム */
  public form!: FormGroup;
  /** ページデータの状態管理オブジェクト */
  private dataState$ = new BehaviorSubject<{ isLoading?: boolean; error?: Error | string }>({ isLoading: true });
  /** ローディング中か否か */
  public isLoading$  = this.dataState$.pipe(map(dataState => dataState.isLoading));
  /** エラー */
  public error$      = this.dataState$.pipe(map(dataState => dataState.error));
  /** NG ドメイン一覧 */
  public ngDomains$  = this.ngDomainsService.ngDomains$;
  
  constructor(
    private formBuilder: FormBuilder,
    private ngDomainsService: NgDomainsService,
    private pageTitleService: PageTitleService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.form = this.formBuilder.group({
      domain: ['', [Validators.required]]
    });
    this.pageTitleService.setPageTitle('NG ドメイン管理');
    
    try {
      await this.ngDomainsService.findAll();
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
    if(this.form.value.domain == null || this.form.value.domain.trim() === '') return;  // iOS で空登録ができてしまうバグ回避
    this.dataState$.next({});  // Clear Error
    try {
      // NOTE : 登録データは小文字に統一する・プロトコル部分があれば除去しておく
      const domain = `${this.form.value.domain}`.trim().toLowerCase().replace(/^https?:\/\//, '');
      
      if(this.ngDomains$.getValue()!.some(ngDomain => ngDomain.domain === domain)) {
        this.dataState$.next({ error: `${domain} は登録済です。` });
        return this.form.reset();
      }
      
      await this.ngDomainsService.create(new NgDomain({ domain }));
      this.form.reset();
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  public async remove(id: number): Promise<void> {
    this.dataState$.next({});  // Clear Error
    try {
      await this.ngDomainsService.remove(id);
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
  
  public async reloadAll(): Promise<void> {
    this.dataState$.next({ isLoading: true });
    try {
      await this.ngDomainsService.findAll(true);
      this.dataState$.next({ isLoading: false });
    }
    catch(error: any) {
      this.dataState$.next({ error });
    }
  }
}
