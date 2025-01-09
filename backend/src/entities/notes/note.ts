import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** ノート */
@Entity('notes')
export class Note {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public id: number;
  /** テキスト */
  @Column({ type: 'text', name: 'text' })
  public text: string;
  
  constructor(partial: Partial<Note>) { Object.assign(this, partial); }
}
