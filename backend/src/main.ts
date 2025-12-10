import * as express from 'express';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { AppModule } from './app.module';
import { cyan, yellow } from './core/utils/colour-logger';
import { listRoutes } from './core/utils/list-routes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // JSON を解釈できるようにする
  app.use(express.json());
  // CORS を有効にする
  app.enableCors({
    // 色々調整した結果 `origin` は配列で問題なくなった
    //origin: 'https://neos21.net',  // NOTE : 配列だと1要素でもダメで、コレが一番 PV カウンタの Fetch を成功させるには確実
    //origin: (origin, callback) => { callback(null, true); },  // 全許可でも大丈夫
    origin: [(/localhost/u), 'https://app.neos21.net', 'https://neos21.net'],  // `localhost` を全て許可するため正規表現を使う
    // NOTE : nginx 側で以下の設定を行ってある
    //        location / {
    //          proxy_pass  http://127.0.0.1:2121;
    //          # For WebSocket
    //          proxy_http_version  1.1;
    //          proxy_set_header  Upgrade $http_upgrade;
    //          proxy_set_header  Connection "upgrade";
    //          proxy_set_header  Host $host;
    //          # For Access Counter
    //          proxy_set_header  Origin              https://$host;
    //          proxy_set_header  IP                  $remote_addr;                # クライアント IP
    //          proxy_set_header  X-Real-IP           $remote_addr;                # クライアント IP
    //          proxy_set_header  X-Forwarded-For     $proxy_add_x_forwarded_for;  # カンマ区切りのリスト・先頭がクライアント IP
    //          proxy_set_header  X-Forwarded-Host    $host;                       # ホスト名
    //          proxy_set_header  X-Forwarded-Server  $host;                       # ホスト名
    //          proxy_set_header  X-Forwarded-Proto   $scheme;                     # プロトコル (`https` など)
    //          proxy_set_header  Accept-Language     $http_accept_language;       # 言語情報
    //          add_header  Accept-CH "Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Model, Sec-CH-UA-Full-Version, Sec-CH-UA-Full-Version-List" always;  # ブラウザに送信要求するヘッダ
    //          add_header  Permissions-Policy "ch-ua=*, ch-ua-mobile=*, ch-ua-platform=*, ch-ua-platform-version=*, ch-ua-arch=*, ch-ua-bitness=*, ch-ua-model=*, ch-ua-full-version=*, ch-ua-full-version-list=*" always;           # クライアントの送出を許可するヘッダ
    //          # Preflight および POST を成功させるための設定
    //          if ($request_method = OPTIONS) {
    //            add_header Access-Control-Allow-Origin $http_origin;
    //            add_header Access-Control-Allow-Credentials true;
    //            add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS";
    //            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
    //            return 204;
    //          }
    //          proxy_hide_header Access-Control-Allow-Origin;
    //          if ($request_method = POST) {
    //            add_header Access-Control-Allow-Origin $http_origin always;
    //          }
    //        }
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Credentials',
    credentials: true  // `Access-Control-Allow-Credentials` を許可する
  });
  
  // HTTP サーバからルート情報を取得しておく
  const httpAdapterHost = app.get(HttpAdapterHost);
  const httpServer = httpAdapterHost.httpAdapter.getHttpServer();
  const router = httpServer._events.request._router;
  
  // WebSocket アダプタを適用する
  app.useWebSocketAdapter(new IoAdapter(app));
  
  // サーバを起動する
  const port = app.get<ConfigService>(ConfigService).get<number>('port')!;
  await app.listen(port);
  
  const logger = new Logger(bootstrap.name);
  logger.log(cyan(`Server Started At Port [`) + yellow(`${port}`) + cyan(']'));
  
  // ルーティング一覧を出力する
  logger.log(listRoutes(router));
}
void bootstrap();
