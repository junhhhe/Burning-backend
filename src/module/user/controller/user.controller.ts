import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtAccessGuard from '../../auth/passport/auth.jwt-access.guard';
import { createServerExceptionResponse } from '../../../global/response/common';
import UserService from '../service/user.service';
import { GetUser } from '../../../global/decorators/user.decorators';
import User from '../../auth/domain/user.entity';
import CommonResponse from '../../../global/dto/common.response';
import { RequestProfileUpdateDto } from '../dto/request/user.profile.update.request.dto';
import { RequestReviewSaveDto } from '../dto/request/party.review.save.dto';

@ApiTags('User')
@ApiResponse(createServerExceptionResponse())
@UseGuards(JwtAccessGuard)
@Controller({ path: '/user', version: '1' })
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/host')
  @ApiOperation({ summary: '내가 주최한 파티 목록 조회' })
  @ApiResponse({ status: 200, description: '주최한 파티 조회 성공' })
  public async getHostedParties(@GetUser() user: User) {
    const data = await this.userService.getHostParty(user);
    return CommonResponse.createResponse({
      data: data,
      message: '주최한 파티 조회 성공',
      statusCode: 200,
    });
  }

  @Get('/join')
  @ApiOperation({ summary: '내가 참여한 파티 목록 조회' })
  @ApiResponse({ status: 200, description: '참여한 파티 조회 성공' })
  public async getJoinedParties(@GetUser() user: User) {
    const data = await this.userService.getJoinParty(user);
    return CommonResponse.createResponse({
      data: data,
      message: '참여한 파티 조회 성공',
      statusCode: 200,
    });
  }

  @Get('/reviews')
  @ApiOperation({ summary: '내가 작성한 리뷰 조회' })
  @ApiResponse({ status: 200, description: '작성한 리뷰 조회 성공' })
  public async getMyReviews(@GetUser() user: User) {
    const data = await this.userService.getMyReviews(user);
    return CommonResponse.createResponse({
      data: data,
      message: '작성한 리뷰 조회 성공',
      statusCode: 200,
    });
  }

  @Get('/profile')
  @ApiOperation({ summary: '내 프로필 조회' })
  @ApiResponse({ status: 200, description: '내 프로필 조회 성공' })
  public async getProfile(@GetUser() user: User) {
    const data = await this.userService.getProfile(user);
    return CommonResponse.createResponse({
      data: data,
      message: '내 프로필 조회 성공',
      statusCode: 200,
    });
  }

  @Patch('/profile')
  @ApiOperation({ summary: '내 프로필 수정' })
  @ApiResponse({ status: 200, description: '내 프로필 수정 성공' })
  public async updateProfile(
    @GetUser() user: User,
    @Body() dto: RequestProfileUpdateDto,
  ) {
    const data = await this.userService.updateProfile(user, dto);
    return CommonResponse.createResponse({
      data: data,
      message: '내 프로필 수정 성공',
      statusCode: 200,
    });
  }

  @Post('/add/review')
  @ApiOperation({ summary: '리뷰 등록' })
  @ApiResponse({ status: 201, description: '리뷰 등록 성공' })
  public async addReview(
    @GetUser() user: User,
    @Body() dto: RequestReviewSaveDto,
  ) {
    await this.userService.addReview(user, dto);
    return CommonResponse.createResponseMessage({
      message: '리뷰가 등록되었습니다.',
      statusCode: 201,
    });
  }
}
