export class NgDomain {
  public id!: number;
  public domain!: string;
  
  constructor(partial: Partial<NgDomain>) { Object.assign(this, partial); }
}
