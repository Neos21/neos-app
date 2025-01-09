import { Response } from 'express';

import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Note } from '../../entities/notes/note';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Res() response: Response): Promise<Response<Array<Note>>> {
    const notes = await this.notesService.findAll();
    if(notes == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Find Notes' });
    return response.status(HttpStatus.OK).json(notes);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response): Promise<Response<Note>> {
    const note = await this.notesService.findOne(id);
    if(note == null) return response.status(HttpStatus.NOT_FOUND).json({ error: 'Failed To Find Note' });
    return response.status(HttpStatus.OK).json(note);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Res() response: Response): Promise<Response<void>> {
    const createdNote = await this.notesService.create();
    if(createdNote == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create Note' });
    return response.status(HttpStatus.OK).json(createdNote);
  }
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  public async save(@Param('id', ParseIntPipe) id: number, @Body('text') text: string, @Res() response: Response): Promise<Response<void>> {
    const updatedNote = await this.notesService.save(id, text);
    if(updatedNote == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Update Note' });
    return response.status(HttpStatus.OK).json(updatedNote);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number, @Res() response: Response): Promise<Response<void>> {
    const deleteResult = await this.notesService.remove(id);
    if(deleteResult == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove Note' });
    return response.status(HttpStatus.NO_CONTENT).end();
  }
}
