// ** Typeorm Imports
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

// ** enum, dto, entity Imports
import BaseTimeEntity from '../../../global/entity/BaseTime.Entity';
import { UserRole } from '../../../global/enum/user.role';
import { Gender } from '../enum/gender.enum';
import Party from '../../party/domain/party.entity';
import Review from '../../party/domain/review.entity';
import Notification from '../../party/domain/notification.entity';
import PartyMember from '../../game/domain/party.member.entity';
import Correct from '../../game/domain/correct.entity';
import Like from '../../game/domain/like.entity';
import Message from '../../game/domain/message.entity';

@Entity({ name: 'TB_USER' })
@Unique(['username'])
export default class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '이메일',
    name: 'username',
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
    comment: '비밀번호',
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '이름',
    name: 'name',
  })
  name: string;

  @Column({
    type: 'date',
    nullable: false,
    comment: '생년월일',
    name: 'birth',
  })
  birth: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '인스타 아이디',
    name: 'instargram',
  })
  instargram: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
    comment: '성별',
    name: 'gender',
  })
  gender: Gender;

  @Column({
    type: 'boolean',
    default: 1,
    nullable: false,
    comment: '개인정보 동의',
    name: 'agreement',
  })
  agreement: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    comment: '유저 역할',
  })
  role: UserRole;

  @Column({
    type: 'tinyint',
    default: 0,
    name: 'is_deleted',
    nullable: false,
    comment: '삭제 여부',
  })
  isDeleted: boolean;

  @OneToMany(() => Party, (party) => party.partyId)
  partys: Relation<Party>[];

  @OneToMany(() => PartyMember, (partyMember) => partyMember.partyMemberId)
  partyMembers: Relation<PartyMember>[];

  @OneToMany(() => Review, (review) => review.reviewId)
  reviews: Relation<Review>[];

  @OneToMany(() => Notification, (notification) => notification.notificationId)
  notifications: Relation<Notification>[];

  @OneToMany(() => Correct, (correct) => correct.correctId)
  corrects: Relation<Correct>[];

  @OneToMany(() => Like, (like) => like.likeId)
  likes: Relation<Like>[];

  @OneToMany(() => Message, (message) => message.messageId)
  messages: Relation<Message>[];
}
