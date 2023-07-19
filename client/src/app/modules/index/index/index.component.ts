import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  /** 初期表示が完了したかどうか */
  public isLoaded: boolean = false;
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }
  
  public async ngOnInit(): Promise<void | boolean> {
    if(this.authService.accessToken == null) return await this.router.navigate(['/login']);  // 未ログインならこの画面を表示しない
    this.isLoaded = true;
  }
}
