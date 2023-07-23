import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(
    private appService: AppService
  ) { }
  
  @Get('robots.txt')
  public robotsTxt(): string {
    return 'User-agent: *\nDisallow: /\n';
  }
  
  /** AppService が注入できているかの確認用 */
  @Get('/api')
  public getApiRoot(): string {
    return this.appService.getApiRoot();
  }
}
