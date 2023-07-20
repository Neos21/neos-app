export class AmazonItem {
  public id!: number;
  public asin!: string;
  public detailPageUrl!: string;
  public title!: string;
  public imageUrl!: string;
  public imageWidth!: string | number;
  public imageHeight!: string | number;
  public price!: string | number;
  
  constructor(partial: Partial<AmazonItem>) { Object.assign(this, partial); }
}
