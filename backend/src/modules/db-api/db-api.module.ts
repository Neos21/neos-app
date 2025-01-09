import { Module } from '@nestjs/common';

import { JsonDbController } from './json-db.controller';
import { JsonDbService } from './json-db.service';
import { SqliteController } from './sqlite.controller';
import { SqliteService } from './sqlite.service';
import { ValidatorService } from './validator.service';

@Module({
  controllers: [
    JsonDbController,
    SqliteController
  ],
  providers: [
    ValidatorService,
    JsonDbService,
    SqliteService
  ]
})
export class DbApiModule { }
