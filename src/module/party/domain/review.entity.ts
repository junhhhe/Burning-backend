// ** Typeorm Imports
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

// ** enum, dto, entity Imports
import BaseTimeEntity from '../../../global/entity/BaseTime.Entity';
import User from '../../auth/domain/user.entity';
import Party from './party.entity';

@Entity({ name: 'TB_REVIEW' })
export default class Review extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'review_id' })
  reviewId: number;

  @Column({
    type: 'int',
    name: 'rating',
    nullable: false,
    comment: '별점',
  })
  rating: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'content',
    nullable: false,
    comment: '리뷰내용',
  })
  content: string;

  @Column({
    type: 'tinyint',
    default: 0,
    name: 'is_deleted',
    nullable: false,
    comment: '삭제 여부',
  })
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  userId: Relation<User>;

  @ManyToOne(() => Party, (party) => party.reviews, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'party_id' })
  partyId: Relation<Party>;
}
