import { Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { MediaExplorerService } from './media-explorer.service';

import type { Response } from 'express';

@Controller('media-explorer')
export class MediaExplorerController {
  constructor(
    private readonly mediaExplorerService: MediaExplorerService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Post('git-pull')
  public async gitPull(@Res() response: Response): Promise<Response<{ result: string }>> {
    const isSucceeded = await this.mediaExplorerService.gitPull();
    if(!isSucceeded) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Git Pull' });
    return response.status(HttpStatus.OK).json({ result: 'OK' });
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('names/:jsonFileName')
  public async getNamesJson(@Param('jsonFileName') jsonFileName: string, @Res() response: Response): Promise<Response> {
    const json = await this.mediaExplorerService.getNamesJson(jsonFileName);
    if(json == null) return response.status(HttpStatus.NOT_FOUND).json({ error: 'JSON Not Found' });
    return response.status(HttpStatus.OK).json(json);
  }
  
  // `@UseGuards()` を付けてしまうと画像が読み込めない
  @Get('thumbnails/:year/:ymdFileName')
  public getThumbnail(@Param('year') year: string, @Param('ymdFileName') ymdFileName: string, @Res() response: Response): void {
    const thumbnailFilePath = this.mediaExplorerService.getThumbnail(year, ymdFileName);
    return response.status(HttpStatus.OK).sendFile(thumbnailFilePath);
  }
}
