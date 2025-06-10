// ** Nest Imports
import { Module } from '@nestjs/common';

// ** Custom Module Imports
import AuthModule from './auth/auth.module';
import AdapterModule from './adapter/adapter.module';
import PartyModule from './party/party.module';
import GameModule from './game/game.module';

@Module({
  imports: [AuthModule, AdapterModule, PartyModule, GameModule],
  controllers: [],
  providers: [],
})
export class CoreModule {}
