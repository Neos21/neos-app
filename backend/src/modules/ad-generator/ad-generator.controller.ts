import { Response } from 'express';

import { Controller, Get, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdGeneratorService } from './ad-generator.service';
import { AmazonItem } from './classes/amazon-item';
import { RakutenItem } from './classes/rakuten-item';

@Controller('ad-generator')
export class AdGeneratorController {
  constructor(
    private readonly adGeneratorService: AdGeneratorService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('search-amazon')
  public async searchAmazon(@Query('keyword') keyword: string, @Res() response: Response): Promise<Response<Array<AmazonItem>>> {
    const results = await this.adGeneratorService.searchAmazon(keyword);
    if(results == null) return response.status(HttpStatus.NOT_FOUND).json({ error: 'Amazon Results Not Found' });
    return response.status(HttpStatus.OK).json(results);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('search-rakuten')
  public async searchRakuten(@Query('keyword') keyword: string, @Res() response: Response): Promise<Response<Array<RakutenItem>>> {
    const results = await this.adGeneratorService.searchRakuten(keyword);
    if(results == null) return response.status(HttpStatus.NOT_FOUND).json({ error: 'Rakuten Results Not Found' });
    return response.status(HttpStatus.OK).json(results);
  }
}
