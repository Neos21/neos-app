import * as path from 'node:path';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

// Imports
import { configuration } from './core/configs/configuration';
import { AuthModule } from './auth/auth.module';
// Controllers
import { AppController } from './app.controller';
// Providers
import { AppService } from './app.service';
// Configure
import { AccessLogMiddleware } from './core/middlewares/access-log.middleware';

@Module({
  imports: [
    // 環境変数を注入する
    ConfigModule.forRoot({
      isGlobal: true,  // 各 Module での `imports` を不要にする
      load: [configuration]  // 環境変数を読み取り適宜デフォルト値を割り当てるオブジェクトをロードする
    }),
    // ビルドした Angular 資材を配信する
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [{
        rootPath: configService.get<string>('staticDirectoryPath') || path.resolve(__dirname, '../../client/dist')
      }]
    }),
    // Modules
    AuthModule,
    // `/api` の Prefix を付ける
    RouterModule.register([{
      path: 'api',
      children: [
        AuthModule
      ]
    }])
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ]
})
export class AppModule {
  /** 独自のアクセスログ出力ミドルウェアを適用する */
  public configure(middlewareConsumer: MiddlewareConsumer): void {
    middlewareConsumer.apply(AccessLogMiddleware).forRoutes('*');
  }
}
