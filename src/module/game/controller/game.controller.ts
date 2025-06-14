import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createServerExceptionResponse } from '../../../global/response/common';
import GameService from '../service/game.service';
import { GetUser } from '../../../global/decorators/user.decorators';
import JwtAccessGuard from '../../auth/passport/auth.jwt-access.guard';
import CommonResponse from '../../../global/dto/common.response';
import User from '../../auth/domain/user.entity';
import { RequestSubmitAnswerDto } from '../dto/request/game.submit.dto';
import { ResponseApprovedMemberDto } from '../dto/response/game.approve.response.dto';
import { RequestAddLikeDto } from '../dto/request/game.like.dto';
import { RequestSaveMessageDto } from '../dto/request/game.message.dto';

@ApiTags('Game')
@ApiResponse(createServerExceptionResponse())
@UseGuards(JwtAccessGuard)
@Controller({ path: '/game', version: '1' })
export default class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: '좋아요 추가' })
  @ApiResponse({ status: 201, description: '좋아요 추가 성공' })
  @Post('/like')
  public async addLike(@GetUser() user: User, @Body() dto: RequestAddLikeDto) {
    await this.gameService.addLike(user, dto);
    return CommonResponse.createResponseMessage({
      message: '좋아요가 추가되었습니다.',
      statusCode: 201,
    });
  }

  @ApiOperation({ summary: '합격자 전체 조회 (성별 그룹)' })
  @ApiResponse({
    status: 200,
    description: '성별 그룹 합격자 조회 성공',
    type: ResponseApprovedMemberDto,
  })
  @Get('/apprved/members/:partyId')
  public async getApprovedMembersByGender(
    @GetUser() user: User,
    @Param('partyId') partyId: number,
  ) {
    const result = await this.gameService.getApprovedMembers(user, partyId);
    return CommonResponse.createResponse({
      data: result,
      message: '합격자 조회 성공',
      statusCode: 200,
    });
  }

  @ApiOperation({ summary: '게임 시작' })
  @ApiResponse({ status: 200, description: '익명 프로필 제공 성공' })
  @Get('/profile/:partyId')
  public async getAnonymousProfile(
    @GetUser() user: User,
    @Param('partyId') partyId: number,
  ) {
    const game = await this.gameService.startGame(user, partyId);
    return CommonResponse.createResponse({
      data: game,
      message: '익명 프로필을 제공했습니다.',
      statusCode: 200,
    });
  }

  @ApiOperation({ summary: '익명 프로필 조회' })
  @ApiResponse({ status: 200, description: '익명 프로필 조회 성공' })
  @Get('/anonymous/:partyId')
  public async getAssignedAnonymousProfile(
    @GetUser() user: User,
    @Param('partyId') partyId: number,
  ) {
    const profile = await this.gameService.getRandomProfile(user, partyId);
    return CommonResponse.createResponse({
      data: profile,
      message: '익명 프로필을 조회했습니다.',
      statusCode: 200,
    });
  }

  @ApiOperation({ summary: '정답 제출' })
  @ApiResponse({ status: 200, description: '정답 제출 성공' })
  @Post('/submit')
  async submitAnswer(
    @GetUser() user: User,
    @Body() dto: RequestSubmitAnswerDto,
  ) {
    await this.gameService.submitAnswer(user, dto);
    return CommonResponse.createResponseMessage({
      message: '정답 제출 완료',
      statusCode: 200,
    });
  }

  @ApiOperation({ summary: '익명 프로필 실명 확인 (게임 종료 후)' })
  @ApiResponse({ status: 200, description: '실명 정보 제공 성공' })
  @Get('/reveal/:partyId')
  public async revealAnonymousProfileOwner(
    @GetUser() user: User,
    @Param('partyId') partyId: number,
  ) {
    const result = await this.gameService.revealProfileOwner(user, partyId);
    return CommonResponse.createResponse({
      data: result,
      message: '익명 프로필의 실명 정보를 제공했습니다.',
      statusCode: 200,
    });
  }

  @ApiOperation({ summary: '정답 조회 (주최자 전용)' })
  @ApiResponse({ status: 200, description: '정답 반환 성공' })
  @Get('/stats/:partyId')
  async getCorrectStats(
    @GetUser() user: User,
    @Param('partyId') partyId: number,
  ) {
    const stats = await this.gameService.getCorrectAnswers(user, partyId);
    return CommonResponse.createResponse({
      data: stats,
      message: '정답 반환 성공',
      statusCode: 200,
    });
  }

  @ApiOperation({ summary: '쪽지 보내기' })
  @Post('/message')
  public async sendMessage(
    @GetUser() user: User,
    @Body() dto: RequestSaveMessageDto,
  ) {
    await this.gameService.sendMessage(user, dto);
    return CommonResponse.createResponseMessage({
      message: '쪽지를 보냈습니다.',
      statusCode: 201,
    });
  }

  @ApiOperation({ summary: '내가 받은 쪽지 목록 조회' })
  @Get('/message')
  public async getMessages(@GetUser() user: User) {
    const result = await this.gameService.getReceivedMessages(user);
    return CommonResponse.createResponse({
      data: result,
      message: '쪽지를 불러왔습니다.',
      statusCode: 200,
    });
  }
}
