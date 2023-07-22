import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SolilogController } from './solilog.controller';
import { SolilogService } from './solilog.service';

@Module({
  controllers: [
    SolilogController
  ],
  providers: [
    JwtService,
    SolilogService
  ]
})
export class SolilogModule { }
