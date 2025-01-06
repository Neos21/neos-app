import { Body, Controller, Post, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) { }
  
  /**
   * ログインする
   * 
   * @return JWT
   * @throws ログイン失敗時
   */
  @Post('login')
  public async login(@Body('user_name') userName: string, @Body('password') password: string, @Res() res: Response): Promise<Response> {
    if(userName !== this.configService.get<string>('userName') || password !== this.configService.get<string>('password')) throw new UnauthorizedException();
    // JWT を生成しレスポンスする
    const payload = { sub: userName };  // コレが `req.user` に入る
    const json = { accessToken: await this.jwtService.signAsync(payload) };
    return res.json(json);
  }
}
