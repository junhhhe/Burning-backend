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
import CorrectRepository from './repository/correct.repository';
import LikeRepository from './repository/like.repository';
import MessageRepository from './repository/message.repository';
import GameService from './service/game.service';
import GameController from './controller/game.controller';
import PartyModule from '../party/party.module';
import EntryModule from '../entry/entry.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Correct, Like, Message]),
    TypeOrmExModule.forCustomRepository([
      CorrectRepository,
      LikeRepository,
      MessageRepository,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => PartyModule),
    forwardRef(() => EntryModule),
  ],
  exports: [GameService],
  controllers: [GameController],
  providers: [GameService],
})
export default class GameModule {}
