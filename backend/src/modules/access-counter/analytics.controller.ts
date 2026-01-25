import { Controller, Get, HttpStatus, ParseIntPipe, Query, Res } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';
import { DbService } from './db.service';

import type { Response } from 'express';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly dbService: DbService,
    private readonly analyticsService: AnalyticsService
  ) { }
  
  @Get('')
  public async getLogs(
    @Query('id', ParseIntPipe) id: number,
    @Query('ymd') ymd: string,
    @Res() response: Response
  ): Promise<Response> {
    const isValidYmd = this.isValidYmd(ymd);
    if(!isValidYmd) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid Date (YYYY-MM-DD)' });
    const site = await this.dbService.findOne(id);
    if(site == null) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Site Of The ID Does Not Exist' });
    
    try {
      const result = await this.analyticsService.getLogs(id, ymd);
      return response.status(HttpStatus.OK).json({ result });
    }
    catch(error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
  
  private isValidYmd(ymd: string): boolean {
    if(!(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).test(ymd)) return false;
    
    const jst      = new Date(new Date(ymd).getTime() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    const year     = jst.getFullYear();
    const month    = ('0' + (jst.getMonth() + 1)).slice(-2);
    const date     = ('0' +  jst.getDate()      ).slice(-2);
    const dateTime = `${year}-${month}-${date}`;
    return ymd === dateTime;
  }
}
