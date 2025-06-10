// ** Nest Imports
import { forwardRef, Module } from '@nestjs/common';

// ** Typeorm Imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../../global/repository/typeorm-ex.module';

// ** Custom Module Imports
import Notification from './domain/notification.entity';
import Party from './domain/party.entity';
import Review from './domain/review.entity';
import Tag from './domain/tag.entity';
import NotificationRepository from './repository/notification.repository';
import PartyRepository from './repository/party.repository';
import ReviewRepository from './repository/review.repository';
import TagRepository from './repository/tag.repository';
import PartyService from './service/party.service';
import PartyController from './controller/party.controller';
import AuthModule from '../auth/auth.module';
import GameModule from '../game/game.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Party, Review, Tag]),
    TypeOrmExModule.forCustomRepository([
      NotificationRepository,
      PartyRepository,
      ReviewRepository,
      TagRepository,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => GameModule),
  ],
  exports: [PartyService],
  controllers: [PartyController],
  providers: [PartyService],
})
export default class PartyModule {}
