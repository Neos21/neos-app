export class Note {
  public id!: number;
  public text!: string;
  
  constructor(partial: Partial<Note>) { Object.assign(this, partial); }
}
