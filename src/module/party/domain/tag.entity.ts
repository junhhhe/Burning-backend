// ** Typeorm Imports
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

// ** enum, dto, entity Imports
import BaseTimeEntity from '../../../global/entity/BaseTime.Entity';
import Party from './party.entity';

@Entity({ name: 'TB_TAG' })
export default class Tag extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tag_id' })
  tagId: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'tag',
    nullable: false,
    comment: '태그',
  })
  tag: string;

  @Column({
    type: 'tinyint',
    default: 0,
    name: 'is_deleted',
    nullable: false,
    comment: '삭제 여부',
  })
  isDeleted: boolean;

  @ManyToMany(() => Party, (party) => party.tags)
  partys: Relation<Party>[];
}
