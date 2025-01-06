import { Controller, Get, HttpStatus, Param, ParseBoolPipe, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { Category } from '../../entities/hatebu/category';

@Controller('hatebu/categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService
  ) { }
  
  /**
   * 全件取得する
   * 
   * @param isExcludeEntries 紐付く記事一覧を取得しない場合は `true` が指定される
   */
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Query('is_exclude_entries', ParseBoolPipe) isExcludeEntries: boolean, @Res() response: Response): Promise<Response<Array<Category>>> {
    const categories = await this.categoriesService.findAll(isExcludeEntries);
    return response.status(HttpStatus.OK).json(categories);
  }
  
  /**
   * 指定の ID のカテゴリとそれに紐付く記事一覧を取得する
   * 
   * @param isExcludeEntries 紐付く記事一覧を取得しない場合は `true` が指定される
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findById(@Param('id', ParseIntPipe) id: number, @Query('is_exclude_entries', ParseBoolPipe) isExcludeEntries: boolean, @Res() response: Response): Promise<Response<Category>> {
    const category = await this.categoriesService.findById(id, isExcludeEntries);
    if(category == null) return response.status(HttpStatus.NOT_FOUND).json({ error: 'Category Not Found' });
    return response.status(HttpStatus.OK).json(category);
  }
  
  /** 全カテゴリについてスクレイピングして更新し、再度全件取得する */
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async scrapeAll(@Res() response: Response): Promise<Response<Array<Category>>> {
    await this.categoriesService.scrapeAllEntries();
    const categories = await this.categoriesService.findAll();
    return response.status(HttpStatus.OK).json(categories);
  }
  
  /** 指定の ID のカテゴリについてスクレイピングして更新し、再度指定の ID のカテゴリとそれに紐付く記事一覧を取得する */
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  public async scrapeById(@Param('id', ParseIntPipe) id: number, @Res() response: Response): Promise<Response<Category>> {
    await this.categoriesService.scrapeEntries(id);
    const category = await this.categoriesService.findById(id);
    if(category == null) return response.status(HttpStatus.NOT_FOUND).json({ error: 'Category Not Found' });
    return response.status(HttpStatus.OK).json(category);
  }
}
