import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

// Imports
import { configuration } from './core/configs/configuration';
import { AuthModule } from './auth/auth.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { NotesModule } from './modules/notes/notes.module';
import { HatebuModule } from './modules/hatebu/hatebu.module';
import { AdGeneratorModule } from './modules/ad-generator/ad-generator.module';
import { SolilogModule } from './modules/solilog/solilog.module';
import { FileUploaderModule } from './modules/file-uploader/file-uploader.module';
import { MediaExplorerModule } from './modules/media-explorer/media-explorer.module';
import { AccessCounterModule } from './modules/access-counter/access-counter.module';
import { DbApiModule } from './modules/db-api/db-api.module';
import { SshWindowModule } from './modules/ssh-window/ssh-window.module';
// TypeORM
import { Bookmark } from './entities/bookmarks/bookmark';
import { Note } from './entities/notes/note';
import { Category } from './entities/hatebu/category';
import { Entry } from './entities/hatebu/entry';
import { NgUrl } from './entities/hatebu/ng-url';
import { NgWord } from './entities/hatebu/ng-word';
import { NgDomain } from './entities/hatebu/ng-domain';
import { Site } from './entities/access-counter/site';
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
    // ファイルアップローダ
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dest: configService.get<string>('fileDirectoryPath')
      })
    }),
    // Cron 定期実行機能用
    ScheduleModule.forRoot(),
    // ビルドした Angular 資材を配信する
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [{
        rootPath: configService.get<string>('staticDirectoryPath')
      }]
    }),
    // TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('dbFilePath'),
        entities: [
          Bookmark,
          Note,
          Category,
          Entry,
          NgUrl,
          NgWord,
          NgDomain,
          Site
        ],
        synchronize: true
      })
    }),
    // Modules
    AuthModule,
    BookmarksModule,
    NotesModule,
    HatebuModule,
    AdGeneratorModule,
    SolilogModule,
    FileUploaderModule,
    MediaExplorerModule,
    AccessCounterModule,
    DbApiModule,
    SshWindowModule,
    // `/api` の Prefix を付ける
    RouterModule.register([{
      path: 'api',
      children: [
        AuthModule,
        BookmarksModule,
        NotesModule,
        HatebuModule,
        AdGeneratorModule,
        SolilogModule,
        FileUploaderModule,
        MediaExplorerModule,
        AccessCounterModule,
        DbApiModule
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
