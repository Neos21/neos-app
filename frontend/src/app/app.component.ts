import { Component } from '@angular/core';

import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  constructor(
    private readonly authService: AuthService
  ) { }
  
  /** アプリ初期表示時 */
  public ngOnInit(): void {
    this.authService.autoReLogin();  // ログイン済のユーザが再描画した時に復旧する
  }
}
