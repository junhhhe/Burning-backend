import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { MypageService } from '../service/mypage.service';
import { Request } from 'express';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  // ✅ 내가 주최한 파티 조회
  @Get('hosted-parties')
  getHostedParties(@Req() req: Request) {
    const userId = req.user['id'];
    return this.mypageService.getHostedParties(userId);
  }

  // ✅ 내가 참여한 파티 조회
  @Get('joined-parties')
  getJoinedParties(@Req() req: Request) {
    const userId = req.user['id'];
    return this.mypageService.getJoinedParties(userId);
  }

  // ✅ 내가 쓴 리뷰 조회
  @Get('my-reviews')
  getMyReviews(@Req() req: Request) {
    const userId = req.user['id'];
    return this.mypageService.getMyReviews(userId);
  }

  // ✅ 내 프로필 조회
  @Get('profile')
  getProfile(@Req() req: Request) {
    const userId = req.user['id'];
    return this.mypageService.getProfile(userId);
  }

  // ✅ 내 프로필 수정
  @Patch('profile')
  updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user['id'];
    return this.mypageService.updateProfile(userId, updateProfileDto);
  }
}
