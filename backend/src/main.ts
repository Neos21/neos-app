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
    origin: [(/localhost/u), 'https://app.neos21.net'],  // `localhost` を全て許可するため正規表現を使う
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Credentials',
    credentials: true  // `Access-Control-Allow-Credentials` を許可する
  });
  
  // HTTP サーバからルート情報を取得しておく
  const httpAdapterHost = app.get(HttpAdapterHost);
  const httpServer = httpAdapterHost.httpAdapter.getHttpServer();
  const router = httpServer?._events?.request?._router;
  
  // WebSocket アダプタを適用する
  app.useWebSocketAdapter(new IoAdapter(app));
  
  // サーバを起動する
  const port = app.get<ConfigService>(ConfigService).get<number>('port')!;
  await app.listen(port);
  
  const logger = new Logger(bootstrap.name);
  logger.log(cyan(`Server started at port [`) + yellow(`${port}`) + cyan(']'));
  
  // ルーティング一覧を出力する
  logger.log(listRoutes(router));
}
void bootstrap();
