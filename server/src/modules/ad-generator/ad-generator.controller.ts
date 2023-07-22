import { Controller, Get, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AdGeneratorService } from './ad-generator.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('ad-generator')
export class AdGeneratorController {
  constructor(
    private adGeneratorService: AdGeneratorService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('search-amazon')
  public async searchAmazon(@Query('keyword') keyword: string, @Res() res: Response): Promise<Response> {
    const results = await this.adGeneratorService.searchAmazon(keyword);
    if(results == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Amazon Results Not Found' });
    return res.status(HttpStatus.OK).json(results);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('search-rakuten')
  public async searchRakuten(@Query('keyword') keyword: string, @Res() res: Response): Promise<Response> {
    const results = await this.adGeneratorService.searchRakuten(keyword);
    if(results == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Rakuten Results Not Found' });
    return res.status(HttpStatus.OK).json(results);
  }
}
