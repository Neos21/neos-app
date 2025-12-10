export class Pv {
  // POST リクエストボディで送られるモノ・クライアントサイドで取得できなかった場合は `-` が送られてくる
  public id: number;
  public ref: string;
  public url: string;
  public title: string;
  public langs: Array<string>;
  public lang: string;
  public ua: string;
  // `navigator.userAgeentData` が使用可能でない場合は `-` が入る
  public ua_data: {
    brands: Array<{ brand: string; version: string; }>;
    mobile: boolean;
    platform: string;
  } | '-' | '_';
  public ua_model: string;  // 使用可能でない場合は `- (UNDEF)`・取得時に例外が発生した場合は `- (ERROR)`・取得結果が空文字だった場合は `-` が入る
  
  // HTTP リクエストヘッダから取得するモノ・`referer` は常に Fetch 元サイトになるため不要・リクエストヘッダがなかった場合は `_` を入れる
  public header_lang?: string;  // ex. `ja,en-US;q=0.9,en;q=0.8`
  public header_ua?: string;
  public header_ch_ua?: string;  // ex. `"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"`
  public header_ch_ua_mobile?: boolean | '_';  // `?0` = `false`・`?1` = `true` に変換して挿入する
  public header_ch_ua_platform?: string;
  public ip?: string;
  public ip_from?: string;  // IP アドレスを取得したリクエストヘッダ名
  
  // 保存時に設定するモノ
  public jst?: string;  // 必ず日本時間の `YYYY-MM-DD HH:mm:SS`
  
  constructor(partial: Partial<Pv>) { Object.assign(this, partial); }
}
