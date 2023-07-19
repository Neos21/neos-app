import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(
    private notesService: NotesService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findOne(@Res() res: Response): Promise<Response> {
    const note = await this.notesService.findOne();
    return res.status(HttpStatus.OK).json(note);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async save(@Body('text') text: string, @Res() res: Response): Promise<Response> {
    const insertResult = await this.notesService.save(text);
    if(insertResult == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Update Note' });
    return res.status(HttpStatus.OK).end();
  }
}
