import { Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MediaExplorerService } from './media-explorer.service';

@Controller('media-explorer')
export class MediaExplorerController {
  constructor(
    private mediaExplorerService: MediaExplorerService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Post('git-pull')
  public async gitPull(@Res() res: Response): Promise<Response> {
    const isSucceeded = await this.mediaExplorerService.gitPull();
    if(!isSucceeded) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Git Pull' });
    return res.status(HttpStatus.OK).json({ result: 'OK' });
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('names/:jsonFileName')
  public async getNamesJson(@Param('jsonFileName') jsonFileName: string, @Res() res: Response): Promise<Response> {
    const json = await this.mediaExplorerService.getNamesJson(jsonFileName);
    if(json == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'JSON Not Found' });
    return res.status(HttpStatus.OK).json(json);
  }
  
  // `@UseGuards()` を付けてしまうと画像が読み込めない
  @Get('thumbnails/:year/:ymdFileName')
  public getThumbnail(@Param('year') year: string, @Param('ymdFileName') ymdFileName: string, @Res() res: Response): void {
    const thumbnailFilePath = this.mediaExplorerService.getThumbnail(year, ymdFileName);
    return res.status(HttpStatus.OK).sendFile(thumbnailFilePath);
  }
}
