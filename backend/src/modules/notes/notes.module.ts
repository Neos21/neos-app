import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Note } from '../../entities/notes/note';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Note
    ])
  ],
  controllers: [
    NotesController
  ],
  providers: [
    JwtService,
    NotesService
  ]
})
export class NotesModule { }
