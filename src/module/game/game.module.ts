// ** Nest Imports
import { forwardRef, Module } from '@nestjs/common';

// ** Typeorm Imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../../global/repository/typeorm-ex.module';

// ** Custom Module Imports
import AuthModule from '../auth/auth.module';
import Correct from './domain/correct.entity';
import Like from './domain/like.entity';
import Message from './domain/message.entity';
import PartyMember from './domain/party.member.entity';
import CorrectRepository from './repository/correct.repository';
import LikeRepository from './repository/like.repository';
import MessageRepository from './repository/message.repository';
import PartyMemberRepository from './repository/party.member.repository';
import GameService from './service/game.service';
import GameController from './controller/game.controller';
import PartyModule from '../party/party.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Correct, Like, Message, PartyMember]),
    TypeOrmExModule.forCustomRepository([
      CorrectRepository,
      LikeRepository,
      MessageRepository,
      PartyMemberRepository,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => PartyModule),
  ],
  exports: [GameService],
  controllers: [GameController],
  providers: [GameService],
})
export default class GameModule {}
