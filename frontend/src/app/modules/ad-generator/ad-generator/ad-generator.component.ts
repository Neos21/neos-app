import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AdGeneratorService } from '../services/ad-generator.service';
import { AmazonItem } from '../classes/amazon-item';
import { RakutenItem } from '../classes/rakuten-item';

@Component({
  selector: 'app-ad-generator',
  templateUrl: './ad-generator.component.html',
  styleUrls: ['./ad-generator.component.css'],
  standalone: false
})
export class AdGeneratorComponent {
  /** フォーム */
  public form!: FormGroup;
  /** 処理中かどうか */
  public isProcessing: boolean = false;
  /** Amazon コード */
  public amazonCode: string = '';
  /** Rakuten コード */
  public rakutenCode: string = '';
  /** Amazon エラー */
  public amazonError?: Error | string;
  /** Rakuten エラー */
  public rakutenError?: Error | string;
  /** Amazon 検索結果 */
  public amazonResults: Array<AmazonItem> = [];
  /** 楽天検索結果 */
  public rakutenResults: Array<RakutenItem> = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private adGeneratorService: AdGeneratorService
  ) { }
  
  public async ngOnInit(): Promise<void | boolean> {
    this.form = this.formBuilder.group({
      keyword: ['', [Validators.required]]
    });
  }
  
  public searchBoth() {
    this.searchAmazon();
    this.searchRakuten();
  }
  
  public async searchAmazon(): Promise<void | string> {
    this.amazonError = undefined;
    if(this.form.value.keyword === '') return this.amazonError = 'Please Input Keyword';
    try {
      this.amazonResults = await this.adGeneratorService.searchAmazon(this.form.value.keyword);
    }
    catch(_error: any) {
      this.amazonError = 'Amazon Results Not Found';
      this.amazonResults = [];
    }
  }
  
  public async searchRakuten(): Promise<void | string> {
    this.rakutenError = undefined;
    if(this.form.value.keyword === '') return this.rakutenError = 'Please Input Keyword';
    try {
      this.rakutenResults = await this.adGeneratorService.searchRakuten(this.form.value.keyword);
    }
    catch(_error: any) {
      this.rakutenError = 'Rakuten Results Not Found';
      this.rakutenResults = [];
    }
  }
  
  /** テキストエリアからコードをコピーする */
  public copy(event: Event): void {
    (event as any).target.select();
    document.execCommand('copy');
  }
  
  /**
   * Amazon コードを挿入しクリップボードにコピーする
   * 
   * @param item 商品1件
   */
  public insertAmazon(item: AmazonItem): void {
    this.amazonCode = this.adGeneratorService.generateAmazonCode(item);
    setTimeout(() => {
      (document.getElementById('amazon-code') as any).select();
      document.execCommand('copy');
    }, 1);
  }
  
  /**
   * 楽天コードを挿入しクリップボードにコピーする
   * 
   * @param item 商品1件
   */
  public insertRakuten(item: RakutenItem): void {
    this.rakutenCode = this.adGeneratorService.generateRakutenCode(item);
    setTimeout(() => {
      (document.getElementById('rakuten-code') as any).select();
      document.execCommand('copy');
    }, 1);
  }
}
