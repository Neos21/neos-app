export class Entry {
  public id!: number;
  public categoryId!: number;
  public title!: string;
  public url!: string;
  public description!: string;
  public count!: string;
  public date!: string;
  public faviconUrl!: string;
  public thumbnailUrl!: string;
  public createdAt!: string;
  
  constructor(partial: Partial<Entry>) { Object.assign(this, partial); }
}
