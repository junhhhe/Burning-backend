// ** Nest Imports
import { forwardRef, Module } from '@nestjs/common';

// ** Typeorm Imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../../global/repository/typeorm-ex.module';

// ** Custom Module Imports
import AuthModule from '../auth/auth.module';
import PartyModule from '../party/party.module';
import Notification from './domain/notification.entity';
import PartyMember from './domain/party.member.entity';
import NotificationRepository from './repository/notification.repository';
import PartyMemberRepository from './repository/party.member.repository';
import EntryService from './service/entry.service';
import EntryController from './controller/entry.controller';
import GameModule from '../game/game.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, PartyMember]),
    TypeOrmExModule.forCustomRepository([
      NotificationRepository,
      PartyMemberRepository,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => PartyModule),
    forwardRef(() => GameModule),
  ],
  exports: [EntryService],
  controllers: [EntryController],
  providers: [EntryService],
})
export default class EntryModule {}
