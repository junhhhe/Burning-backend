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
import PartyMember from '../../entry/domain/party.member.entity';
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

  //랜덤 익명 프로필 주인 - 실제 정답자
  @ManyToOne(() => PartyMember, (partyMember) => partyMember.corrects, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'correct_member_id' })
  correctMemberId: Relation<PartyMember>;

  //예상 제출
  @ManyToOne(() => PartyMember, (partyMember) => partyMember.targets, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'target_member_id' })
  targetMemberId: Relation<PartyMember>;

  @ManyToOne(() => User, (user) => user.corrects, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  userId: Relation<User>;
}
