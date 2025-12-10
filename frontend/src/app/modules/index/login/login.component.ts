import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  /** 初期表示が完了したか否か */
  public isLoaded: boolean = false;
  /** フォーム */
  public form!: FormGroup;
  /** 処理中か否か */
  public isProcessing: boolean = false;
  /** エラーメッセージ */
  public error?: string;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }
  
  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    if(this.authService.accessToken != null) {
      this.router.navigate(['/index']);  // ログイン済ならこの画面を表示しない
      return;
    }
    this.isLoaded = true;
  }
  
  public async login(): Promise<void> {
    this.error = undefined;
    this.isProcessing = true;
    const isSucceeded = await this.authService.login(this.form.value.userName, this.form.value.password);
    if(isSucceeded) {
      this.router.navigate(['/index']);
      return;
    }
    this.error = 'Failed To Login';
    this.isProcessing = false;
  }
}
