import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AmazonItem } from '../classes/amazon-item';
import { RakutenItem } from '../classes/rakuten-item';
import { AdGeneratorService } from '../services/ad-generator.service';

@Component({
  selector: 'app-ad-generator',
  templateUrl: './ad-generator.component.html',
  styleUrls: ['./ad-generator.component.css'],
  standalone: false
})
export class AdGeneratorComponent {
  /** フォーム */
  public form!: FormGroup;
  /** 処理中か否か */
  public isProcessing: boolean = false;
  /** Amazon コード */
  public amazonCode: string = '';
  /** Rakuten コード */
  public rakutenCode: string = '';
  /** Amazon エラー */
  public amazonError?: string;
  /** Rakuten エラー */
  public rakutenError?: string;
  /** Amazon 検索結果 */
  public amazonResults: Array<AmazonItem> = [];
  /** 楽天検索結果 */
  public rakutenResults: Array<RakutenItem> = [];
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly adGeneratorService: AdGeneratorService
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
    catch(_error) {
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
    catch(_error) {
      this.rakutenError = 'Rakuten Results Not Found';
      this.rakutenResults = [];
    }
  }
  
  /** テキストエリアからコードをコピーする */
  public copy(event: MouseEvent): void {
    (event.target as HTMLTextAreaElement).select();
    document.execCommand('copy');
  }
  
  /** Amazon コードを挿入しクリップボードにコピーする */
  public insertAmazon(item: AmazonItem): void {
    this.amazonCode = this.adGeneratorService.generateAmazonCode(item);
    window.setTimeout(() => {
      (document.getElementById('amazon-code') as HTMLTextAreaElement).select();
      document.execCommand('copy');
    }, 1);
  }
  
  /** 楽天コードを挿入しクリップボードにコピーする */
  public insertRakuten(item: RakutenItem): void {
    this.rakutenCode = this.adGeneratorService.generateRakutenCode(item);
    window.setTimeout(() => {
      (document.getElementById('rakuten-code') as HTMLTextAreaElement).select();
      document.execCommand('copy');
    }, 1);
  }
}
