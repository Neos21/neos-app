import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Site } from '../../entities/access-counter/site';
import { AccessCounterController } from './access-counter.controller';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { CanvasService } from './canvas.service';
import { DbService } from './db.service';
import { PvService } from './pv.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Site
    ])
  ],
  controllers: [
    AccessCounterController,
    AnalyticsController
  ],
  providers: [
    PvService,
    CanvasService,
    DbService,
    AnalyticsService
  ]
})
export class AccessCounterModule { }
