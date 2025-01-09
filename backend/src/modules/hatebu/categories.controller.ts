import { Response } from 'express';

import { Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Category } from '../../entities/hatebu/category';
import { CategoriesService } from './categories.service';

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
  public async findAll(@Query('is_exclude_entries') queryIsExcludeEntries: string | boolean, @Res() response: Response): Promise<Response<Array<Category>>> {
    const isExcludeEntries = this.isTruthy(queryIsExcludeEntries);
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
  public async findById(@Param('id', ParseIntPipe) id: number, @Query('is_exclude_entries') queryIsExcludeEntries: string | boolean, @Res() response: Response): Promise<Response<Category>> {
    const isExcludeEntries = this.isTruthy(queryIsExcludeEntries);
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
  
  /**
   * `@Query()` はどうしても文字列型になってしまい、ParseBoolPipe も効かなかったので文字列であっても Boolean を判定できるようにする
   * 
   * @param value 値
   * @return 値が Truthy か否か
   */
  private isTruthy(value?: string | boolean): boolean {
    if(value == null) return false;
    if(typeof value === 'boolean') return value;
    if((/^(true|yes|1)$/iu).test(value)) return true;
    if((/^(false|no|0)$/iu).test(value)) return false;
    return Boolean(value);  // その他の文字列や型の場合 (空文字は `false`)
  }
}
