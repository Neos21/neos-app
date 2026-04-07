import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Media Explorer 用辞書 : 1レコードで全データを保持する */
@Entity('dictionaries')
export class Dictionary {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public id: number;
  /** テキスト */
  @Column({ type: 'text', name: 'text' })
  public text: string;
  
  constructor(partial: Partial<Dictionary>) { Object.assign(this, partial); }
}
