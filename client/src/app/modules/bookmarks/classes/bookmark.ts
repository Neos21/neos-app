export class Bookmark {
  public id?: number;
  public url?: string;
  
  constructor(partial: Partial<Bookmark>) { Object.assign(this, partial); }
}
