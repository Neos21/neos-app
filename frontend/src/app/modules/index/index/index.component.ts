import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  standalone: false
})
export class IndexComponent {
  /** 初期表示が完了したかどうか */
  public isLoaded: boolean = false;
  
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }
  
  public ngOnInit(): void {
    if(this.authService.accessToken == null) {
      this.router.navigate(['/login']);  // 未ログインならこの画面を表示しない
      return;
    }
    this.isLoaded = true;
  }
  
  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
