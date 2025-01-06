import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** ブックマーク */
@Entity('bookmarks')
export class Bookmark {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public id: number;
  /** URL */
  @Column({ type: 'text', name: 'url' })
  public url: string;
  
  constructor(partial: Partial<Bookmark>) { Object.assign(this, partial); }
}
