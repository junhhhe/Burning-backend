// ** Nest Imports
import { forwardRef, Module } from '@nestjs/common';

// ** Typeorm Imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../../global/repository/typeorm-ex.module';

// ** Custom Module Imports
import AuthModule from '../auth/auth.module';
import PartyModule from '../party/party.module';
import EntryModule from '../entry/entry.module';
import UserService from './service/user.service';
import UserController from './controller/user.controller';
import GameModule from '../game/game.module';
import User from '../auth/domain/user.entity';
import UserRepository from '../auth/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    forwardRef(() => AuthModule),
    forwardRef(() => PartyModule),
    forwardRef(() => EntryModule),
    forwardRef(() => GameModule),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export default class UserModule {}
