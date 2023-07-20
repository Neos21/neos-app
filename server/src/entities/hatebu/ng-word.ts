import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * NG ワード
 * 
 * - API 経由で登録と削除を行えるようにする (個別レコードを更新する機能は用意しない)
 */
@Entity('hatebu_ng_words')
export class NgWord {
  /** ID */
  @PrimaryGeneratedColumn({ name: 'id' })
  public id: number;
  /** NG ワード */
  @Column({ type: 'text', name: 'word' })
  public word: string;
  
  constructor(partial: Partial<NgWord>) { Object.assign(this, partial); }
}
