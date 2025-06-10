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
import Party from '../../party/domain/party.entity';
import PartyMember from './party.member.entity';
import User from '../../auth/domain/user.entity';

@Entity({ name: 'TB_CORRECT' })
export default class Correct extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'correct_id' })
  correctId: number;

  @Column({
    type: 'boolean',
    default: 0,
    name: 'answer',
    nullable: false,
    comment: '정답 여부',
  })
  answer: boolean;

  @Column({
    type: 'tinyint',
    default: 0,
    name: 'is_deleted',
    nullable: false,
    comment: '삭제 여부',
  })
  isDeleted: boolean;

  @ManyToOne(() => Party, (party) => party.corrects, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'party_id' })
  partyId: Relation<Party>;

  @ManyToOne(() => PartyMember, (partyMember) => partyMember.corrects, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'party_member_id' })
  partyMemberId: Relation<PartyMember>;

  @ManyToOne(() => User, (user) => user.corrects, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  userId: Relation<User>;
}
