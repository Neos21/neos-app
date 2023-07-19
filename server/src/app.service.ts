import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /** AppController からの注入確認用 */
  public getApiRoot(): string {
    return 'Hello World';
  }
}
