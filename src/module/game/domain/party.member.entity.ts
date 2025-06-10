// ** Typeorm Imports
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

// ** enum, dto, entity Imports
import BaseTimeEntity from '../../../global/entity/BaseTime.Entity';
import Correct from './correct.entity';
import Like from './like.entity';
import Message from './message.entity';
import User from '../../auth/domain/user.entity';
import Party from '../../party/domain/party.entity';

@Entity({ name: 'TB_PARTY_MEMBER' })
export default class PartyMember extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'party_member_id' })
  partyMemberId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '자기소개',
    name: 'detail',
  })
  detail: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '별명',
    name: 'introduce',
  })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '취미',
    name: 'hobby',
  })
  hobby: string;

  @Column({
    type: 'varchar',
    length: 4,
    nullable: false,
    comment: 'MBTI',
    name: 'mbti',
  })
  mbti: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '프로필 이미지',
    name: 'profile_image',
  })
  profileImage: string;

  @Column({
    type: 'boolean',
    default: 0,
    nullable: false,
    comment: '승인여부',
    name: 'approval',
  })
  approval: boolean;

  @Column({
    type: 'tinyint',
    default: 0,
    name: 'is_deleted',
    nullable: false,
    comment: '삭제 여부',
  })
  isDeleted: boolean;

  @ManyToOne(() => Party, (party) => party.partyMembers, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'party_id' })
  partyId: Relation<Party>;

  @ManyToOne(() => User, (user) => user.partyMembers, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  userId: Relation<User>;

  @OneToMany(() => Correct, (correct) => correct.partyMemberId)
  corrects: Relation<Correct>[];

  @OneToMany(() => Like, (like) => like.partyMemberId)
  likes: Relation<Like>[];

  @OneToMany(() => Message, (message) => message.partyMemberId)
  messages: Relation<Message>[];
}
