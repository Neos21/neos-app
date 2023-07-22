import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileUploaderService } from './file-uploader.service';

@Controller('file-uploader')
export class FileUploaderController {
  constructor(
    private fileUploaderService: FileUploaderService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('files')
  public async findAll(@Res() res: Response): Promise<Response> {
    const files = await this.fileUploaderService.findAll();
    return res.status(HttpStatus.OK).json(files);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('files/:fileName')
  public async downloadFile(@Param('fileName') fileName: string, @Res() res: Response): Promise<Response> {
    const file = await this.fileUploaderService.findOne(fileName);
    return res.status(HttpStatus.OK).send(file);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('fileName') fileName: string, @Res() res: Response): Promise<Response> {
    const isSucceeded = await this.fileUploaderService.uploadFile(file, fileName);
    if(!isSucceeded) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Upload File' });
    return res.status(HttpStatus.CREATED).end();
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete('files')
  public async remove(@Body('fileName') fileName: string, @Res() res: Response): Promise<Response> {
    const isSucceeded = await this.fileUploaderService.remove(fileName);
    if(!isSucceeded) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove File' });
    return res.status(HttpStatus.OK).end();
  }
}
