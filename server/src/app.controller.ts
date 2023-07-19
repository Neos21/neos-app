import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(
    private appService: AppService
  ) { }
  
  /** AppService が注入できているかの確認用 */
  @Get('/api')
  public getApiRoot(): string {
    return this.appService.getApiRoot();
  }
}
