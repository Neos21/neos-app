import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AdGeneratorController } from './ad-generator.controller';
import { AdGeneratorService } from './ad-generator.service';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [
    AdGeneratorController
  ],
  providers: [
    JwtService,
    AdGeneratorService
  ]
})
export class AdGeneratorModule { }
