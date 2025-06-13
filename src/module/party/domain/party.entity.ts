// ** Typeorm Imports
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

// ** enum, dto, entity Imports
import BaseTimeEntity from '../../../global/entity/BaseTime.Entity';
import { PartyState } from '../enum/party.state';
import User from '../../auth/domain/user.entity';
import Review from './review.entity';
import Notification from '../../entry/domain/notification.entity';
import Correct from '../../game/domain/correct.entity';
import Like from '../../game/domain/like.entity';
import Message from '../../game/domain/message.entity';
import PartyMember from '../../entry/domain/party.member.entity';
import Tag from './tag.entity';

@Entity({ name: 'TB_PARTY' })
export default class Party extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'party_id' })
  partyId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '썸네일',
    name: 'party_image',
  })
  partyImage: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '파티제목',
    name: 'title',
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: '파티 설명',
    name: 'content',
  })
  content: string;

  @Column({
    type: 'datetime',
    nullable: false,
    comment: '파티 일시',
    name: 'party_date',
  })
  partyDate: Date;

  @Column({
    type: 'varchar',
    nullable: false,
    comment: '파티 장소',
    name: 'location',
  })
  location: string;

  @Column({
    type: 'enum',
    nullable: false,
    comment: '파티 장소',
    enum: PartyState,
    default: PartyState.OPEN,
    name: 'party_state',
  })
  partyState: PartyState;

  @Column({
    type: 'int',
    nullable: false,
    comment: '모집 인원',
    name: 'personnel',
  })
  personnel: number;

  @Column({
    type: 'datetime',
    nullable: false,
    comment: '파티 시작일',
    name: 'start_date',
  })
  startDate: Date;

  @Column({
    type: 'datetime',
    nullable: false,
    comment: '파티 마감일',
    name: 'end_date',
  })
  endDate: Date;

  @Column({
    type: 'tinyint',
    default: 0,
    name: 'is_deleted',
    nullable: false,
    comment: '삭제 여부',
  })
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.partys, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  userId: Relation<User>;

  @OneToMany(() => PartyMember, (partyMember) => partyMember.partyId)
  partyMembers: Relation<PartyMember>;

  @OneToMany(() => Review, (review) => review.partyId)
  reviews: Relation<Review>[];

  @OneToMany(() => Correct, (correct) => correct.partyId)
  corrects: Relation<Correct>[];

  @OneToMany(() => Like, (like) => like.partyId)
  likes: Relation<Like>[];

  @OneToMany(() => Message, (message) => message.partyId)
  messages: Relation<Message>[];

  @OneToOne(() => Notification, (notification) => notification.partyId)
  notifications: Relation<Notification>;

  @ManyToMany(() => Tag, (tag) => tag.partys, {
    cascade: true,
    nullable: false,
  })
  @JoinTable({
    name: 'TB_PARTY_TAG',
    joinColumn: {
      name: 'party_id',
      referencedColumnName: 'partyId',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'tagId',
    },
  })
  tags: Relation<Tag>[];
}
