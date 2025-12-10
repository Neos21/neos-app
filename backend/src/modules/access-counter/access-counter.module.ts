import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Site } from '../../entities/access-counter/site';
import { AccessCounterController } from './access-counter.controller';
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
    AccessCounterController
  ],
  providers: [
    PvService,
    CanvasService,
    DbService
  ]
})
export class AccessCounterModule { }
