import { Response } from 'express';

import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileUploaderService } from './file-uploader.service';

@Controller('file-uploader')
export class FileUploaderController {
  constructor(
    private readonly fileUploaderService: FileUploaderService
  ) { }
  
  @UseGuards(JwtAuthGuard)
  @Get('files')
  public async findAll(@Res() response: Response): Promise<Response<Array<string>>> {
    const files = await this.fileUploaderService.findAll();
    return response.status(HttpStatus.OK).json(files);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('files/:fileName')
  public async downloadFile(@Param('fileName') fileName: string, @Res() response: Response): Promise<Response<Buffer>> {
    const file = await this.fileUploaderService.findOne(fileName);
    return response.status(HttpStatus.OK).send(file);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('file_name') fileName: string, @Res() response: Response): Promise<Response<void>> {
    const isSucceeded = await this.fileUploaderService.uploadFile(file, fileName);
    if(!isSucceeded) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Upload File' });
    return response.status(HttpStatus.CREATED).end();
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete('files')
  public async remove(@Body('file_name') fileName: string, @Res() response: Response): Promise<Response<void>> {
    const isSucceeded = await this.fileUploaderService.remove(fileName);
    if(!isSucceeded) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed To Remove File' });
    return response.status(HttpStatus.OK).end();
  }
}
