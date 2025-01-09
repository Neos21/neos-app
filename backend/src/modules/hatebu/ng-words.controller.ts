import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NgWord } from '../../entities/hatebu/ng-word';
import { NgWordsService } from './ng-words.service';

import type { Response } from 'express';

@Controller('hatebu/ng-words')
export class NgWordsController {
  constructor(
    private readonly ngWordsService: NgWordsService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Res() response: Response): Promise<Response<Array<NgWord>>> {
    const ngWords = await this.ngWordsService.findAll();
    return response.status(HttpStatus.OK).json(ngWords);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Body() ngWord: NgWord, @Res() response: Response): Promise<Response<NgWord>> {
    const createdNgWord = await this.ngWordsService.create(ngWord);
    if(createdNgWord == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create NG Word' });
    return response.status(HttpStatus.CREATED).json(createdNgWord);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number, @Res() response: Response): Promise<Response<void>> {
    const deleteResult = await this.ngWordsService.remove(id);
    if(deleteResult == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove NG Word' });
    return response.status(HttpStatus.OK).end();
  }
}
