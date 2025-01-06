import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NotesService } from './notes.service';
import { Note } from '../../entities/notes/note';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findOne(@Res() response: Response): Promise<Response<Note>> {
    const note = await this.notesService.findOne();
    return response.status(HttpStatus.OK).json(note);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async save(@Body('text') text: string, @Res() response: Response): Promise<Response<void>> {
    const insertResult = await this.notesService.save(text);
    if(insertResult == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Update Note' });
    return response.status(HttpStatus.OK).end();
  }
}
