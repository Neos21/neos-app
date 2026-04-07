import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MediaExplorerService } from '../services/media-explorer.service';

/** 辞書 */
type ParsedDictionary = {
  /** 同階層の類語 */
  names: Array<string>;
  /** 子階層の類語があれば定義する */
  children?: Array<ParsedDictionary>;
}

@Component({
  selector: 'app-media-explorer',
  templateUrl: './media-explorer.component.html',
  styleUrls: ['./media-explorer.component.css'],
  standalone: false
})
export class MediaExplorerComponent {
  /** エラー */
  public error?: Error | string;
  /** 現在年のデータ */
  public current?: { year: string; names: Array<string>; };
  /** 過去年のデータ */
  public past?: Array<{ year: string; names: Array<string>; }>;
  /** Family のデータ */
  public family?: { title: string; names: Array<string>; };
  /** サムネイル画像の URL (`img` 要素の `src` 属性値に追加する */
  public thumbnailUrl?: string;
  /** フォーム */
  public form!: FormGroup;
  /** 処理中か否か */
  public isProcessing: boolean = true;
  /** 検索中か否か */
  public isSearching: boolean = false;
  /** 辞書 */
  public parsedDictionary: Array<ParsedDictionary> = [];
  /** 検索前の元データ (検索取消時に復元するための控え用) */
  private originalCurrent?: { year: string; names: Array<string>; };
  private originalPast?: Array<{ year: string; names: Array<string>; }>;
  private originalFamily?: { title: string; names: Array<string>; };
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly mediaExplorerService: MediaExplorerService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    this.isProcessing = true;
    this.form = this.formBuilder.group({
      search    : ['', []],
      dictionary: ['', []]
    });
    try {
      await Promise.all([
        (async () => { this.form.setValue({ search: '', dictionary: await this.mediaExplorerService.fetchDictionary() }); })(),
        (async () => { this.current = this.originalCurrent = await this.mediaExplorerService.fetchCurrentJson(); })(),
        (async () => { this.past    = this.originalPast    = await this.mediaExplorerService.fetchPastJson();    })(),
        (async () => { this.family  = this.originalFamily  = await this.mediaExplorerService.fetchFamilyJson();  })()
      ]);
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.parseDictionary();
      this.isProcessing = false;
    }
  }
  
  public async onGitPull(): Promise<void> {
    this.error = undefined;
    try {
      await this.mediaExplorerService.gitPull();
    }
    catch(error: any) {
      this.error = error;
    }
  }
  
  public async onSearch(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 0));  // 1文字目がうまく検索状態にならないため遅延させる
    
    const search = this.form.value.search.trim();
    if(search === '') {
      this.isSearching = false;
      // 元データから復元する
      this.current = this.originalCurrent;
      this.past    = this.originalPast;
      this.family  = this.originalFamily;
      return;
    }
    
    this.isSearching = true;
    const searchLowerCase = search.toLowerCase();
    
    // 検索キーワードに該当するすべてのキーワードを取得する
    const matchedKeywords = this.getMatchedKeywords(searchLowerCase);
    
    // フィルタリング処理
    this.current!.names = this.originalCurrent!.names.filter(name => this.isNameMatched(name, matchedKeywords, searchLowerCase));
    this.past = this.originalPast!.map(item => ({
      ...item,
      names: item.names.filter(name => this.isNameMatched(name, matchedKeywords, searchLowerCase))
    }));
    this.family!.names = this.originalFamily!.names.filter(name => this.isNameMatched(name, matchedKeywords, searchLowerCase));
  }
  
  /** 辞書から検索キーワードにマッチするすべてのキーワードを取得する */
  private getMatchedKeywords(searchLowerCase: string): Set<string> {
    const keywords = new Set<string>();
    
    const collect = (dictionary: ParsedDictionary) => {
      let isMatched = false;
      // このノードの `names` 配列内に一つでもマッチするものがあるかチェックする
      for(const name of dictionary.names) {
        if(name.toLowerCase().includes(searchLowerCase)) {
          isMatched = true;
          break;
        }
      }
      
      if(isMatched) {
        // マッチしたので同階層のすべてのキーワードと配下すべてを追加する
        for(const name of dictionary.names) keywords.add(name.toLowerCase());
        this.collectAllChildKeywords(dictionary, keywords);
      }
      else {
        // マッチしなかったので子ノードを探索する
        if(dictionary.children != null) for(const child of dictionary.children) collect(child);
      }
    };
    
    for(const root of this.parsedDictionary) collect(root);
    return keywords;
  }
  
  /** ノードの配下すべてのキーワードを収集する */
  private collectAllChildKeywords(dictionary: ParsedDictionary, keywords: Set<string>): void {
    if(dictionary.children == null) return;
    for(const child of dictionary.children) {
      for(const name of child.names) keywords.add(name.toLowerCase());
      this.collectAllChildKeywords(child, keywords);
    }
  }
  
  /** 名前がマッチしたキーワードセットまたは検索キーワードで該当するかチェックする */
  private isNameMatched(name: string, matchedKeywords: Set<string>, searchLowerCase: string): boolean {
    const nameLowerCase = name.toLowerCase();
    
    // `matchedKeywords` に含まれるいずれかのキーワードが name に含まれているかチェックする
    for(const keyword of matchedKeywords) if(nameLowerCase.includes(keyword)) return true;
    
    // `matchedKeywords` にマッチしなかった場合、直接検索キーワードで検索する
    return nameLowerCase.includes(searchLowerCase);
  }
  
  public async onSaveDictionary(): Promise<void> {
    this.error = undefined;
    this.isProcessing = true;
    try {
      await this.mediaExplorerService.saveDictionary(this.form.value.dictionary.trim());
    }
    catch(error: any) {
      this.error = error;
    }
    finally {
      this.parseDictionary();
      this.isProcessing = false;
    }
  }
  
  /**
   * 西暦と名前部分の `YYYY-MM-DD` の情報を使ってサムネイル画像を取得する
   * 
   * @param year 西暦
   * @param name 名前
   */
  public onClickName(year: string, name: string): void {
    this.error = undefined;
    const match = name.match((/^.*(\d{4}-\d{2}-\d{2}).*$/u));
    if(match == null) {
      this.error = 'Invalid Name';
      return;
    }
    const ymd = match[1];
    this.thumbnailUrl = this.mediaExplorerService.getThumbnailUrl(year, ymd);
  }
  
  public onCloseThumbnail(): void {
    this.error = undefined;
    this.thumbnailUrl = undefined;
  }
  
  private parseDictionary(): void {
    const dictionary = this.form.value.dictionary.trim();
    const lines = dictionary.split('\n');
    
    const root: ParsedDictionary = { names: [] };
    const stack: Array<{ node: ParsedDictionary; indent: number; }> = [{ node: root, indent: -1 }];
    
    for (const line of lines) {
      if(line.trim() === '') continue;  // 空行はスキップする
      
      const indentMatch = line.match(/^　*/);  // 行頭の全角文字の数をインデント数とする
      const indent = indentMatch ? indentMatch[0].length : 0;
      const names = line.trim().split('|').map((name: string) => name.trim()).filter((name: string) => name !== '');
      
      const node: ParsedDictionary = { names };
      
      // スタックからインデントレベルに応じた親を探す
      while(stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      
      const parent = stack[stack.length - 1].node;
      if(parent.children == null) parent.children = [];
      parent.children.push(node);
      stack.push({ node, indent });
    }
    
    // トップレベルは配列とする
    this.parsedDictionary = root.children ?? [];
  }
}
