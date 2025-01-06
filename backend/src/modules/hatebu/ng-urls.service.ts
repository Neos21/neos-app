import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

import { NgUrl } from '../../entities/hatebu/ng-url';

@Injectable()
export class NgUrlsService {
  private readonly logger: Logger = new Logger(NgUrlsService.name);
  
  constructor(
    @InjectRepository(NgUrl) private readonly ngUrlsRepository: Repository<NgUrl>
  ) { }
  
  public async findAll(): Promise<Array<NgUrl> | null> {
    return await this.ngUrlsRepository.find({ order: { createdAt: 'DESC' } }).catch(_error => null);
  }
  
  public async create(ngUrl: NgUrl): Promise<NgUrl | null> {
    const insertResult = await this.ngUrlsRepository.insert(ngUrl);
    const id = insertResult.identifiers?.[0]?.id;
    if(id == null) return null;  // Failed to insert NgUrl
    return await this.ngUrlsRepository.findOneBy({ id }).catch(_error => null);
  }
  
  /**
   * 指定日付以前のデータを削除する : Cron Job スケジュール用・フロントエンドからの呼び出しはナシ
   * 
   * `created_at` カラムは ISO8601 表記の UTC `YYYY-MM-DDTHH:mm:SS.sssZ` で記録されているため削除条件とする日時情報は UTC で計算することになる
   * 大まかに過去データが削除できればよく厳密さは求めないので、適当に1週間程度以前のデータを削除する
   */
  public async removeByCreatedAt(): Promise<void> {
    const now = new Date();
    const minusDates = 7;  // 現在日から何日前以前のデータを削除するか
    const targetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - minusDates, 0, 0, 0, 0));  // マイナス値等は適切に処理してくれる
    this.logger.log(`#removeByCreatedAt() : Target date [${targetDate.toISOString()}]`);
    const deleteResult = await this.ngUrlsRepository.delete({ createdAt: LessThanOrEqual(targetDate) });
    this.logger.log(`#removeByCreatedAt() : Removed rows [${deleteResult.affected}]`);
  }
}
