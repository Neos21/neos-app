import { Response } from 'express';

import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NgDomain } from '../../entities/hatebu/ng-domain';
import { NgDomainsService } from './ng-domains.service';

@Controller('hatebu/ng-domains')
export class NgDomainsController {
  constructor(
    private readonly ngDomainsService: NgDomainsService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Res() response: Response): Promise<Response<Array<NgDomain>>> {
    const ngDomains = await this.ngDomainsService.findAll();
    return response.status(HttpStatus.OK).json(ngDomains);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Body() ngDomain: NgDomain, @Res() response: Response): Promise<Response<NgDomain>> {
    const createdNgDomain = await this.ngDomainsService.create(ngDomain);
    if(createdNgDomain == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create NG Domain' });
    return response.status(HttpStatus.CREATED).json(createdNgDomain);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number, @Res() response: Response): Promise<Response<void>> {
    const deleteResult = await this.ngDomainsService.remove(id);
    if(deleteResult == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove NG Domain' });
    return response.status(HttpStatus.OK).end();
  }
}
