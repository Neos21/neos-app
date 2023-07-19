import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** JWT アクセストークン : LocalStorage からのインメモリキャッシュ・この有無でログイン済か否かを判定する */
  public accessToken?: string;
  /** JWT アクセストークンを保存する LocalStorage キー名 */
  private readonly accessTokenStorageKey = 'access_token';
  
  constructor(private httpClient: HttpClient) { }
  
  /** ログインする・成功すれば `true`・失敗すれば `false` */
  public async login(userName: string, password: string): Promise<boolean> {
    try {
      // ログイン試行する
      const { accessToken } = await firstValueFrom(this.httpClient.post<{ accessToken: string; }>('/api/auth/login', { user_name: userName, password }));  // Throws
      // ログインできたら LocalStorage とキャッシュを保存する
      window.localStorage.setItem(this.accessTokenStorageKey, accessToken);
      this.accessToken = accessToken;
      return true;
    }
    catch(error) {
      console.warn('AuthService#login() : Failed To Login', error);
      return false;
    }
  }
  
  /** 自動再ログインする : LocalStorage から JWT を取得し控える */
  public autoReLogin(): boolean {
    if(this.accessToken != null) return true;
    try {
      const accessToken = window.localStorage.getItem(this.accessTokenStorageKey);
      if(accessToken == null) return false;
      this.accessToken = accessToken;  // ココで控えることで CustomInterceptor が JWT を使えるようになる
      return true;
    }
    catch(error) {
      console.warn('AuthService#autoReLogin() : Failed To Re-Login', error);
      return false;
    }
  }
  
  /** ログアウトする */
  public logout(): void {
    window.localStorage.removeItem(this.accessTokenStorageKey);
    this.accessToken = undefined;
  }
}
