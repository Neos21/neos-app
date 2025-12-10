import amazonPaapi from 'amazon-paapi';
import { firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AmazonItem } from './classes/amazon-item';
import { RakutenItem } from './classes/rakuten-item';

@Injectable()
export class AdGeneratorService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) { }
  
  public async searchAmazon(keyword: string): Promise<Array<AmazonItem> | null> {
    /** Amazon PA API 用の共通パラメータ */
    const commonParameters = {
      AccessKey  : this.configService.get('amazonAccessKey'),
      SecretKey  : this.configService.get('amazonSecretKey'),
      PartnerTag : this.configService.get('amazonPartnerTag'),
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.co.jp'
    };
    /** Amazon PA API 用のリクエストパラメータ */
    const requestParameters = {
      Keywords   : keyword,
      SearchIndex: 'All',
      ItemCount  : 10,  // 10件が最大
      Resources  : [
        'ItemInfo.Title',
        'Images.Primary.Medium',
        'Offers.Listings.Price'
      ]
    };
    const data = await amazonPaapi.SearchItems(commonParameters, requestParameters).catch(_error => null);
    if(data?.SearchResult?.Items == null || data.SearchResult.Items.length === 0) return null;
    const results = data.SearchResult.Items.map((item, index) => new AmazonItem({
      id           : index,
      asin         : item?.ASIN                                 || '',
      detailPageUrl: item?.DetailPageURL                        || '',
      title        : item?.ItemInfo?.Title?.DisplayValue        || '',
      imageUrl     : item?.Images?.Primary?.Medium?.URL         || '',
      imageWidth   : item?.Images?.Primary?.Medium?.Width       || '',
      imageHeight  : item?.Images?.Primary?.Medium?.Height      || '',
      price        : item?.Offers?.Listings?.[0]?.Price?.Amount || '-'
    }));
    return results;
  }
  
  public async searchRakuten(keyword: string): Promise<Array<RakutenItem> | null> {
    const rakutenApplicationId = this.configService.get('rakutenApplicationId');
    const rakutenAffiliateId   = this.configService.get('rakutenAffiliateId');
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?format=json&keyword=${encodedKeyword}&applicationId=${rakutenApplicationId}&affiliateId=${rakutenAffiliateId}`;
    const response = await firstValueFrom(this.httpService.get(url)).catch(_error => null);
    const data = response?.data;
    if(data?.Items == null || data.Items.length === 0 || data?.error != null) return null;
    const results = data.Items.map((item, index) => new RakutenItem({
      id       : index,
      itemName : item?.Item?.itemName                       || '',
      itemUrl  : item?.Item?.affiliateUrl                   || '',  // `itemUrl` は同じ値
      imageUrl : item?.Item?.mediumImageUrls?.[0]?.imageUrl || '',
      shopName : item?.Item?.shopName                       || '',
      shopUrl  : item?.Item?.shopAffiliateUrl               || '',  // `shopUrl` は同じ値
      itemPrice: item?.Item?.itemPrice                      || '-'
    }));
    return results;
  }
}
