export class NgWord {
  public id!: number;
  public word!: string;
  
  constructor(partial: Partial<NgWord>) { Object.assign(this, partial); }
}
