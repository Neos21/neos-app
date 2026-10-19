import { text, type Request, type Response } from 'express';
import { Body, Controller, Get, Headers, HttpStatus, Ip, ParseIntPipe, Post, Query, Req, Res } from '@nestjs/common';

import { CanvasService } from './canvas.service';
import { Pv } from './classes/pv';
import { DbService } from './db.service';
import { PvService } from './pv.service';

@Controller('access-counter')
export class AccessCounterController {
  constructor(
    private readonly pvService: PvService,
    private readonly canvasService: CanvasService,
    private readonly dbService: DbService
  ) { }
  
  @Post('pv')
  public async updatePv(
    @Ip() ip: string,  // `req.ip` と同じ
    @Headers() headers: Headers,
    @Body() pv: Pv,
    @Req() request: Request,
    @Res() response: Response
  ): Promise<Response> {
    // `navigator.sendBeacon()` で送信した場合は `text/plain` で届くので、生のリクエストデータを取得して JSON に変換する
    if(request.is('text/plain')) {
      try {
        await new Promise<void>((resolve, reject) => { text({ type: 'text/plain' })(request, response, error => error ? reject(error) : resolve()); });
      }
      catch(error) {
        const status = (error as { status?: number }).status === HttpStatus.PAYLOAD_TOO_LARGE ? HttpStatus.PAYLOAD_TOO_LARGE : HttpStatus.BAD_REQUEST;
        return response.status(status).json({ error: 'Failed To Read PV Body (Text Plain)' });
      }
      // 引数 `pv` は空オブジェクトの状態なのでココでパースして代入する
      try {
        pv = JSON.parse(request.body);
      }
      catch {
        return response.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid JSON Body' });
      }
    }
    
    // 本文を読み取った後に ID を検証する・数値型にできなかった場合は 400 が返る
    const id = await new ParseIntPipe().transform(String(pv?.id), { type: 'body', data: 'id' });
    
    // 指定 ID のサイト定義が存在すること
    const site = await this.dbService.findOne(id);
    if(site == null) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Site Of The ID Does Not Exist' });
    
    // まずはとにかくカウンタを更新する
    const updatedSite = await this.dbService.updatePv(id);
    if(updatedSite == null) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Update PV' });
    
    // ログファイルに追記する : 非同期で行わせるためわざと `await` しない
    this.pvService.savePv(pv, headers, ip);
    
    return response.status(HttpStatus.OK).end();
  }
  
  @Get('total')
  public async totalImage(@Query('id') id: string, @Query('digit') digit: string, @Res() response: Response): Promise<void | Response> {
    const [idError, numberId] = this.validateNumber(id, 'ID');
    if(idError != null) return response.status(HttpStatus.BAD_REQUEST).json({ error: idError });
    const [digitError, numberDigit] = this.validateNumber(digit, 'Digit');
    if(digitError != null) return response.status(HttpStatus.BAD_REQUEST).json({ error: digitError });
    const site = await this.dbService.findOne(numberId);
    if(site == null) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Site Of The ID Does Not Exist' });
    
    const fileStream = this.canvasService.createRedCounter(site.total, numberDigit);
    fileStream.pipe(response.status(HttpStatus.OK));
  }
  
  @Get('today')
  public async todayImage(@Query('id') id: string, @Query('digit') digit: string, @Res() response: Response): Promise<void | Response> {
    const [idError, numberId] = this.validateNumber(id, 'ID');
    if(idError != null) return response.status(HttpStatus.BAD_REQUEST).json({ error: idError });
    const [digitError, numberDigit] = this.validateNumber(digit, 'Digit');
    if(digitError != null) return response.status(HttpStatus.BAD_REQUEST).json({ error: digitError });
    const site = await this.dbService.findOne(numberId);
    if(site == null) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Site Of The ID Does Not Exist' });
    
    const fileStream = this.canvasService.createGreenCounter(site.today, numberDigit);
    fileStream.pipe(response.status(HttpStatus.OK));
  }
  
  @Get('yesterday')
  public async yesterdayImage(@Query('id') id: string, @Query('digit') digit: string, @Res() response: Response): Promise<void | Response> {
    const [idError, numberId] = this.validateNumber(id, 'ID');
    if(idError != null) return response.status(HttpStatus.BAD_REQUEST).json({ error: idError });
    const [digitError, numberDigit] = this.validateNumber(digit, 'Digit');
    if(digitError != null) return response.status(HttpStatus.BAD_REQUEST).json({ error: digitError });
    const site = await this.dbService.findOne(numberId);
    if(site == null) return response.status(HttpStatus.BAD_REQUEST).json({ error: 'The Site Of The ID Does Not Exist' });
    
    const fileStream = this.canvasService.createYellowCounter(site.yesterday, numberDigit);
    fileStream.pipe(response.status(HttpStatus.OK));
  }
  
  private validateNumber(value: any, name: string): [string | null, number?] {
    if(value == null) return [`The Query ${name} Is Emtpy`];  // `null` だけ0に変換されるので事前に防いでおく
    const number = Number(value);
    if(!Number.isInteger(number)) return [`The Query ${name} Is Not Integer`];
    return [null, number];
  }
}
