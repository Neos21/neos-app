import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { ApiService } from '../services/api.service';
import { CategoriesService } from '../services/categories.service';
import { PageTitleService } from '../services/page-title.service';

@Component({
  selector: 'app-hatebu',
  templateUrl: './hatebu.component.html',
  styleUrls: ['./hatebu.component.css'],
  standalone: false
})
export class HatebuComponent {
  /** 画面幅が狭い時にサイドメニュー `aside` を開いているかどうか */
  private isShownMenu = false;
  /** 左利きモードか否か (`true` がデフォルト左利きモード・`false` で右利きモード) */
  private isLeftHandMode = true;
  
  constructor(
    private renderer2: Renderer2,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private apiService: ApiService,
    public categoriesService: CategoriesService,
    public pageTitleService: PageTitleService
  ) { }
  
  public ngOnInit(): void {
    this.apiService.fetchAll();  // どのページを読み込んでもメニューが表示されるようにする
    // ページ遷移時はサイドメニューを閉じ、ページトップに遷移させる
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.toggleMenu(false);
        this.moveToTop();  // `RouterModule.forRoot()` の `scrollPositionRestoration: 'enabled'` だと動きがカクつくので止めた
      }
    });
  }
  
  /**
   * サイドメニューを開閉する
   * 
   * @param isShown サイドメニューを強制的に開く場合は `true`・強制的に閉じる場合は `false` を指定する
   */
  public toggleMenu(isShown?: boolean): void {
    // 引数が指定されていれば引数に従って操作、そうでなければ現在の状態を反転させる
    this.isShownMenu = isShown != null ? isShown : !this.isShownMenu;
    this.renderer2[this.isShownMenu ? 'addClass' : 'removeClass'](this.document.body, 'show-menu');
  }
  
  /** 利き手モードを切り替える */
  public toggleHand(): void {
    this.isLeftHandMode = !this.isLeftHandMode;
    this.renderer2[this.isLeftHandMode ? 'removeClass' : 'addClass'](this.document.body, 'right-hand-mode');
  }
  
  /** * ページ最上部に戻る */
  public moveToTop(): void {
    window.scrollTo(0, 0);
  }
}
