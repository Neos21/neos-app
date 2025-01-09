import { firstValueFrom } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AmazonItem } from '../classes/amazon-item';
import { RakutenItem } from '../classes/rakuten-item';

@Injectable()
export class AdGeneratorService {
  constructor(
    private readonly httpClient: HttpClient
  ) { }
  
  public async searchAmazon(keyword: string): Promise<Array<AmazonItem>> {
    return await firstValueFrom(this.httpClient.get<Array<AmazonItem>>(`/api/ad-generator/search-amazon?keyword=${keyword}`));
  }
  
  public async searchRakuten(keyword: string): Promise<Array<RakutenItem>> {
    return await firstValueFrom(this.httpClient.get<Array<RakutenItem>>(`/api/ad-generator/search-rakuten?keyword=${keyword}`));
  }
  
  /**
   * Amazon コードを生成する
   * 
   * @param item 商品1件
   */
  public generateAmazonCode(item: AmazonItem): string {
    const url   = this.sanitizeHtml(item.detailPageUrl);
    const title = this.sanitizeHtml(item.title);
    const amazonCode = `\n\n<div class="ad-amazon">
  <div class="ad-amazon-image">
    <a href="${url}">
      <img src="${item.imageUrl}" width="${item.imageWidth}" height="${item.imageHeight}">
    </a>
  </div>
  <div class="ad-amazon-info">
    <div class="ad-amazon-title">
      <a href="${url}">${title}</a>
    </div>
  </div>
</div>`;
    return amazonCode;
  }
  
  /**
   * 楽天コードを生成する
   * 
   * @param item 商品1件
   */
  public generateRakutenCode(item: RakutenItem): string {
    const itemUrl  = this.sanitizeHtml(item.itemUrl);
    const shopUrl  = this.sanitizeHtml(item.shopUrl);
    const itemName = this.sanitizeHtml(item.itemName);
    const shopName = this.sanitizeHtml(item.shopName);
    const rakutenCode = `\n\n<div class="ad-rakuten">
  <div class="ad-rakuten-image">
    <a href="${itemUrl}">
      <img src="${item.imageUrl}">
    </a>
  </div>
  <div class="ad-rakuten-info">
    <div class="ad-rakuten-title">
      <a href="${itemUrl}">${itemName}</a>
    </div>
    <div class="ad-rakuten-shop">
      <a href="${shopUrl}">${shopName}</a>
    </div>
    <div class="ad-rakuten-price">価格 : ${item.itemPrice}円</div>
  </div>
</div>`;
    return rakutenCode;
  }
  
  private sanitizeHtml(value: string): string {
    return value.replace((/&/gu), '&amp;').replace((/"/gu), '&quot;').replace((/</gu), '&lt;').replace((/>/gu), '&gt;');
  }
}
