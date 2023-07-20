import { Controller, Get, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';

@Controller('hatebu/categories')
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService
  ) { }
  
  /**
   * 全件取得する
   * 
   * @param queryIsExcludeEntries 紐付く記事一覧を取得しない場合は `'true'` が指定される
   */
  @UseGuards(JwtAuthGuard)
  @Get('')
  public async findAll(@Query('is_exclude_entries') queryIsExcludeEntries: string | boolean, @Res() res: Response): Promise<Response> {
    const isExcludeEntries = this.isTruthy(queryIsExcludeEntries);
    const categories = await this.categoriesService.findAll(isExcludeEntries);
    return res.status(HttpStatus.OK).json(categories);
  }
  
  /**
   * 指定の ID のカテゴリとそれに紐付く記事一覧を取得する
   * 
   * @param queryIsExcludeEntries 紐付く記事一覧を取得しない場合は `'true'` が指定される
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findById(@Param('id') id: number, @Query('is_exclude_entries') queryIsExcludeEntries: string | boolean, @Res() res: Response): Promise<Response> {
    const isExcludeEntries = this.isTruthy(queryIsExcludeEntries);
    const category = await this.categoriesService.findById(id, isExcludeEntries);
    if(category == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Category Not Found' });
    return res.status(HttpStatus.OK).json(category);
  }
  
  /** 全カテゴリについてスクレイピングして更新し、再度全件取得する */
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async scrapeAll(@Res() res: Response): Promise<Response> {
    await this.categoriesService.scrapeAllEntries();
    const categories = await this.categoriesService.findAll();
    return res.status(HttpStatus.OK).json(categories);
  }
  
  /** 指定の ID のカテゴリについてスクレイピングして更新し、再度指定の ID のカテゴリとそれに紐付く記事一覧を取得する */
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  public async scrapeById(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    await this.categoriesService.scrapeEntries(id);
    const category = await this.categoriesService.findById(id);
    if(category == null) return res.status(HttpStatus.NOT_FOUND).json({ error: 'Category Not Found' });
    return res.status(HttpStatus.OK).json(category);
  }
  
  /**
   * `@Query()` はどうしても文字列型になってしまうようなので文字列であっても Boolean を判定できるようにする
   * 
   * @param value 値
   * @return 値が Truthy か否か
   */
  private isTruthy(value?: string | boolean): boolean {
    if(value == null) return false;
    if(typeof value === 'boolean') return value;
    if((/^(true|yes|1)$/i).test(value)) return true;
    if((/^(false|no|0)$/i).test(value)) return false;
    return Boolean(value);  // その他の文字列や型の場合 (空文字は `false`)
  }
}
