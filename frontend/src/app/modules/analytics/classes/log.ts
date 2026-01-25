/** 画面表示する項目だけ定義しておく */
export class Log {
  public jst!: string;
  public ref!: string;
  public url!: string;
  public title!: string;
  public ip!: string;
  public lang!: string;
  public ua!: string;
  public header_ch_ua_mobile!: boolean;
  public header_ch_ua_platform!: string;
  public ua_model!: string;
  
  constructor(partial: Partial<Log>) { Object.assign(this, partial); }
}
