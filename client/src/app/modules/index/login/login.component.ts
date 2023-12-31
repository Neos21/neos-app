import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /** 初期表示が完了したかどうか */
  public isLoaded: boolean = false;
  /** フォーム */
  public form!: FormGroup;
  /** 処理中かどうか */
  public isProcessing: boolean = false;
  /** エラーメッセージ */
  public error?: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }
  
  public async ngOnInit(): Promise<void | boolean> {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    if(this.authService.accessToken != null) return await this.router.navigate(['/index']);  // ログイン済ならこの画面を表示しない
    this.isLoaded = true;
  }
  
  public async login(): Promise<void | boolean> {
    this.error = undefined;
    this.isProcessing = true;
    const isSucceeded = await this.authService.login(this.form.value.userName, this.form.value.password);
    if(isSucceeded) return await this.router.navigate(['/index']);
    this.error = 'Failed To Login';
    this.isProcessing = false;
  }
}
