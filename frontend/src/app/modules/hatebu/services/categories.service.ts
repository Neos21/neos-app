import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Category } from '../classes/category';

@Injectable()
export class CategoriesService {
  /** カテゴリ一覧のキャッシュ */
  public categories$ = new BehaviorSubject<Array<Category> | null>(null);
  
  constructor(
    private readonly httpClient: HttpClient
  ) { }
  
  /**
   * カテゴリ一覧とそれぞれに紐付く記事一覧を取得する
   * 
   * @param isForce `true` を指定したら強制再取得する
   */
  public async findAll(isForce?: boolean): Promise<Array<Category>> {
    if(!isForce) {
      const cachedCategories = this.categories$.getValue();
      if(cachedCategories != null) return cachedCategories;  // キャッシュを返す
    }
    // キャッシュがなければ取得してキャッシュする
    const categories = await firstValueFrom(this.httpClient.get<Array<Category>>('/api/hatebu/categories'));
    this.categories$.next(categories);
    return categories;
  }
  
  /**
   * 対象カテゴリとそれに紐付く記事一覧を取得する
   * 
   * @param isForce `true` を指定したら強制再取得する
   */
  public async findById(id: number, isForce?: boolean): Promise<Category> {
    let categories = this.categories$.getValue()!;
    if(categories == null) categories = await this.findAll();  // 万が一データがなかったら取得してしまう
    const targetIndex = categories.findIndex(category => category.id === id);
    if(targetIndex < 0) throw new Error('The Category Does Not Exist');
    if(!isForce) return categories[targetIndex];  // キャッシュを返す
    // 取得してキャッシュする
    const category = await firstValueFrom(this.httpClient.get<Category>(`/api/hatebu/categories/${id}`));
    categories[targetIndex] = category;
    this.categories$.next(categories);
    return category;
  }
  
  /** 全カテゴリの記事一覧を再スクレイピングしてカテゴリ一覧を再取得する */
  public async scrapeAll(): Promise<Array<Category>> {
    // 取得してキャッシュする
    const categories = await firstValueFrom(this.httpClient.post<Array<Category>>('/api/hatebu/categories', {}));
    this.categories$.next(categories);
    return categories;
  }
  
  /** 対象カテゴリの記事一覧を再スクレイピングして取得する */
  public async scrapeById(id: number): Promise<Category> {
    const categories = this.categories$.getValue()!;
    const targetIndex = categories.findIndex(category => category.id === id);
    if(targetIndex < 0) throw new Error('The Category Does Not Exist');
    // 取得してキャッシュする
    const category = await firstValueFrom(this.httpClient.post<Category>(`/api/hatebu/categories/${id}`, {}));
    categories[targetIndex] = category;
    this.categories$.next(categories);
    return category;
  }
}
