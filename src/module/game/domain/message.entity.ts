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

@Entity({ name: 'TB_MESSAGE' })
export default class Message extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'message_id' })
  messageId: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'content',
    nullable: false,
    comment: '쪽지 내용',
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

  @ManyToOne(() => Party, (party) => party.messages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'party_id' })
  partyId: Relation<Party>;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  userId: Relation<User>;

  @ManyToOne(() => PartyMember, (partyMember) => partyMember.messages, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'party_member_id' })
  partyMemberId: Relation<PartyMember>;
}
