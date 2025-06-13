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
import User from '../../auth/domain/user.entity';
import PartyMember from '../../entry/domain/party.member.entity';

@Entity({ name: 'TB_LIKE' })
export default class Like extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'like_id' })
  likeId: number;

  @Column({
    type: 'tinyint',
    default: 0,
    name: 'is_deleted',
    nullable: false,
    comment: '삭제 여부',
  })
  isDeleted: boolean;

  @ManyToOne(() => Party, (party) => party.likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'party_id' })
  partyId: Relation<Party>;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  userId: Relation<User>;

  @ManyToOne(() => PartyMember, (partyMember) => partyMember.likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'party_member_id' })
  partyMemberId: Relation<PartyMember>;
}
