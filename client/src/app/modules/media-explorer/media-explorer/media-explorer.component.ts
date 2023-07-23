import { Component } from '@angular/core';

import { MediaExplorerService } from '../services/media-explorer.service';

@Component({
  selector: 'app-media-explorer',
  templateUrl: './media-explorer.component.html',
  styleUrls: ['./media-explorer.component.css']
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
  /** サムネイル画像の URL (img 要素の src 属性値に追加する */
  public thumbnailUrl?: string;
  
  constructor(
    private mediaExplorerService: MediaExplorerService
  ) { }
  
  public async ngOnInit(): Promise<void> {
    try {
      await Promise.all([
        (async () => { this.current = await this.mediaExplorerService.fetchCurrentJson(); })(),
        (async () => { this.past    = await this.mediaExplorerService.fetchPastJson();    })(),
        (async () => { this.family  = await this.mediaExplorerService.fetchFamilyJson();  })()
      ]);
    }
    catch(error: any) {
      this.error = error;
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
  
  /**
   * 西暦と名前部分の `YYYY-MM-DD` の情報を使ってサムネイル画像を取得する
   * 
   * @param year 西暦
   * @param name 名前
   */
  public onClickName(year: string, name: string): void | string {
    this.error = undefined;
    const match = name.match((/^.*(\d{4}-\d{2}-\d{2}).*$/u));
    if(match == null) return this.error = 'Invalid Name';
    const ymd = match[1];
    this.thumbnailUrl = this.mediaExplorerService.getThumbnailUrl(year, ymd);
  }
  
  public onCloseThumbnail(): void {
    this.error = undefined;
    this.thumbnailUrl = undefined;
  }
}
