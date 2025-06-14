import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MypageController } from './controller/mypage.controller';
import { MypageService } from './service/mypage.service';
import Party from '../party/domain/party.entity';
import Review from '../party/domain/review.entity';
import User from '../auth/domain/user.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([Party, Review, User]),
  ],
  controllers: [MypageController],
  providers: [MypageService],
})
export class MypageModule {}
