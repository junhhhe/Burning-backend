// ** Typeorm Imports
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

// ** enum, dto, entity Imports
import BaseTimeEntity from '../../../global/entity/BaseTime.Entity';
import User from '../../auth/domain/user.entity';
import Party from '../../party/domain/party.entity';

@Entity({ name: 'TB_NOTIFICATION' })
export default class Notification extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'notification_id' })
  notificationId: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'content',
    nullable: false,
    comment: '알림 내ㅇ',
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

  @OneToOne(() => Party, (party) => party.notifications, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'party_id' })
  partyId: Relation<Party>;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  userId: Relation<User>;
}
