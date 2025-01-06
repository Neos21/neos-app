import { Entry } from './entry';

export class Category {
  public id!: number;
  public name!: string;
  public rssUrl!: string;
  public pageUrl!: string;
  public updatedAt!: string;
  
  /** 紐付くエントリ一覧 */
  public entries!: Array<Entry>;
  
  constructor(partial: Partial<Category>) { Object.assign(this, partial); }
}
