import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { NgDomain } from '../classes/ng-domain';

@Injectable()
export class NgDomainsService {
  /** NG ドメインのキャッシュ */
  public ngDomains$ = new BehaviorSubject<Array<NgDomain> | null>(null);
  
  constructor(private httpClient: HttpClient) { }
  
  /**
   * NG ドメイン一覧を取得する
   * 
   * @param isForce `true` を指定したら強制再取得する
   */
  public async findAll(isForce?: boolean): Promise<Array<NgDomain>> {
    if(!isForce) {
      const cachedNgDomains = this.ngDomains$.getValue();
      if(cachedNgDomains != null) return cachedNgDomains;  // キャッシュを返す
    }
    // キャッシュがなければ取得してキャッシュする
    const ngDomains = await firstValueFrom(this.httpClient.get<Array<NgDomain>>('/api/hatebu/ng-domains'));
    this.ngDomains$.next(ngDomains);
    return ngDomains;
  }
  
  public async create(ngDomain: NgDomain): Promise<NgDomain> {
    const createdNgDomain = await firstValueFrom(this.httpClient.post<NgDomain>('/api/hatebu/ng-domains', ngDomain));
    // 登録後のエンティティをキャッシュに追加する
    const ngDomains = this.ngDomains$.getValue()!;
    ngDomains.push(createdNgDomain);
    this.ngDomains$.next(ngDomains);
    return createdNgDomain;
  }
  
  public async remove(id: number): Promise<void> {
    const ngDomains = this.ngDomains$.getValue()!;
    const removedIndex = ngDomains.findIndex(ngDomain => ngDomain.id === id);
    if(removedIndex < 0) throw new Error('The NgDomain ID Does Not Exist');
    await firstValueFrom(this.httpClient.delete(`/api/hatebu/ng-domains/${id}`));
    // 削除したエンティティをキャッシュから削除する
    ngDomains.splice(removedIndex, 1);
    this.ngDomains$.next(ngDomains);
  }
}
