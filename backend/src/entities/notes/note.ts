import { Column, Entity, PrimaryColumn } from 'typeorm';

/** ノート */
@Entity('notes')
export class Note {
  /** ID */
  @PrimaryColumn({ type: 'integer', name: 'id' })
  public id: number;
  /** テキスト */
  @Column({ type: 'text', name: 'text' })
  public text: string;
  
  constructor(partial: Partial<Note>) { Object.assign(this, partial); }
}
