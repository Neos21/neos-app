import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NgWord } from '../../entities/hatebu/ng-word';
import { NgWordsService } from './ng-words.service';

@Controller('hatebu/ng-words')
export class NgWordsController {
  constructor(
    private ngWordsService: NgWordsService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Res() res: Response): Promise<Response> {
    const ngWords = await this.ngWordsService.findAll();
    return res.status(HttpStatus.OK).json(ngWords);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Body() ngWord: NgWord, @Res() res: Response): Promise<Response> {
    const createdNgWord = await this.ngWordsService.create(ngWord);
    if(createdNgWord == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create NG Word' });
    return res.status(HttpStatus.CREATED).json(createdNgWord);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    const deleteResult = await this.ngWordsService.remove(id);
    if(deleteResult == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove NG Word' });
    return res.status(HttpStatus.OK).end();
  }
}
