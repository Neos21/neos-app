import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /** AppController からの注入確認のため */
  public getApiRoot(): string {
    return 'Hello World';
  }
}
