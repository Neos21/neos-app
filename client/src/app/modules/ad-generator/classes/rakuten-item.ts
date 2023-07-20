export class RakutenItem {
  public id!: number;
  public itemName!: string;
  public itemUrl!: string;
  public imageUrl!: string;
  public shopName!: string;
  public shopUrl!: string;
  public itemPrice!: string | number;
  
  constructor(partial: Partial<RakutenItem>) { Object.assign(this, partial); }
}
