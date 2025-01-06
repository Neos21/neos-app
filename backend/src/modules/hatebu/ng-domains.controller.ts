import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NgDomain } from '../../entities/hatebu/ng-domain';
import { NgDomainsService } from './ng-domains.service';

@Controller('hatebu/ng-domains')
export class NgDomainsController {
  constructor(
    private ngDomainsService: NgDomainsService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Res() res: Response): Promise<Response> {
    const ngDomains = await this.ngDomainsService.findAll();
    return res.status(HttpStatus.OK).json(ngDomains);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async create(@Body() ngDomain: NgDomain, @Res() res: Response): Promise<Response> {
    const createdNgDomain = await this.ngDomainsService.create(ngDomain);
    if(createdNgDomain == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Create NG Domain' });
    return res.status(HttpStatus.CREATED).json(createdNgDomain);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public async remove(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    const deleteResult = await this.ngDomainsService.remove(id);
    if(deleteResult == null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove NG Domain' });
    return res.status(HttpStatus.OK).end();
  }
}
