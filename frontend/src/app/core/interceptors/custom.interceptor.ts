import { Observable, timeout } from 'rxjs';

import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../shared/services/auth.service';

/** 長時間実行するリクエストでは明示的にタイムアウトを無効にする */
export const skipRequestTimeout = new HttpContextToken<boolean>(() => false);

@Injectable({ providedIn: 'root' })
export class CustomInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService
  ) { }
  
  /** HttpClient からの通信時に以下の割り込み処理を行う */
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // クッキーによるセッション管理を有効にする
    request = request.clone({ withCredentials: true });
    // JWT アクセストークンが取得できればリクエストヘッダに設定する
    const accessToken = this.authService.accessToken;
    if(accessToken) request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${accessToken}`) });
    // 通常は60秒でタイムアウトする・スクレイピング処理はリトライ等で長時間かかりうるため指定時は回避できるようにしておく
    const response = next.handle(request);
    return request.context.get(skipRequestTimeout) ? response : response.pipe(timeout(60 * 1000));
  }
}
