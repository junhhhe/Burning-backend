import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createServerExceptionResponse } from '../../../global/response/common';
import EntryService from '../service/entry.service';
import JwtAccessGuard from '../../auth/passport/auth.jwt-access.guard';
import { GetUser } from '../../../global/decorators/user.decorators';
import User from '../../auth/domain/user.entity';
import { RequestEntryApplyDto } from '../dto/entry.dto';
import CommonResponse from '../../../global/dto/common.response';
import { RequestPartyMemberApproveDto } from '../dto/entry.approve.dto';
import { ReqeustUpdatePartyStateDto } from '../dto/entry.party.status.dto';
import { RequestInvitationDto } from '../dto/entry.invite.dto';

@ApiTags('Entry')
@ApiResponse(createServerExceptionResponse())
@UseGuards(JwtAccessGuard)
@Controller({ path: '/entry', version: '1' })
export default class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Post('/apply')
  @ApiOperation({ summary: '파티 신청' })
  @ApiResponse({ status: 201, description: '파티 신청 완료' })
  @ApiResponse({ status: 400, description: '이미 신청했거나 파티 없음' })
  public async applyParty(
    @GetUser() user: User,
    @Body() dto: RequestEntryApplyDto,
  ) {
    await this.entryService.apply(user, dto);
    return CommonResponse.createResponseMessage({
      statusCode: 201,
      message: '파티 신청이 완료되었습니다.',
    });
  }

  @ApiOperation({ summary: '파티 신청 취소' })
  @ApiResponse({ status: 200, description: '신청 취소 완료' })
  @ApiResponse({ status: 404, description: '신청 정보 없음' })
  @Delete('/cancel/:partyId')
  public async cancelEntry(
    @GetUser() user: User,
    @Param('partyId') partyId: number,
  ) {
    await this.entryService.cancel(user, partyId);
    return CommonResponse.createResponseMessage({
      statusCode: 200,
      message: '파티 신청이 취소되었습니다.',
    });
  }

  @ApiOperation({ summary: '신청자 목록 조회' })
  @ApiResponse({ status: 200, description: '신청자 목록 조회 성공' })
  @Get('/applicants/:partyId')
  public async getApplicants(
    @GetUser() user: User,
    @Param('partyId') partyId: number,
  ) {
    const applicants = await this.entryService.findApplicants(user, partyId);
    return CommonResponse.createResponse({
      statusCode: 200,
      message: '신청자 목록 조회 성공',
      data: applicants,
    });
  }

  @ApiOperation({ summary: '신청자 승인/거절' })
  @Patch('/approval')
  public async approveMember(
    @GetUser() user: User,
    @Body() dto: RequestPartyMemberApproveDto,
  ) {
    await this.entryService.approveMember(user, dto);
    return CommonResponse.createResponseMessage({
      statusCode: 200,
      message: `신청자 상태가 ${
        dto.approval ? '승인' : '거절'
      } 처리되었습니다.`,
    });
  }

  @ApiOperation({ summary: '모집/마감 상태 변경' })
  @ApiResponse({
    status: 200,
    description: '모집 상태가 성공적으로 변경되었습니다.',
  })
  @Patch('/state')
  public async updatePartyState(
    @GetUser() user: User,
    @Body() dto: ReqeustUpdatePartyStateDto,
  ) {
    await this.entryService.updatePartyState(user, dto);
    return CommonResponse.createResponseMessage({
      statusCode: 200,
      message: '모집 상태가 성공적으로 변경되었습니다.',
    });
  }

  @ApiOperation({ summary: '합격자 한정 초대장 발송' })
  @ApiResponse({ status: 200, description: '초대장 발송 성공' })
  @Post('/invite')
  public async sendInvitations(
    @GetUser() user: User,
    @Body() dto: RequestInvitationDto,
  ) {
    console.log('partyId', dto.partyId);
    const result = await this.entryService.sendInvitations(user, dto);
    return CommonResponse.createResponse({
      data: result,
      message: '초대장이 성공적으로 발송되었습니다.',
      statusCode: 200,
    });
  }

  @ApiOperation({ summary: '초대장 열람' })
  @ApiResponse({ status: 200, description: '초대장 열람 성공' })
  @Get('/invite/:notificationId')
  public async readInvitation(
    @GetUser() user: User,
    @Param('notificationId') notificationId: number,
  ) {
    const result = await this.entryService.readInvitation(user, notificationId);
    return CommonResponse.createResponse({
      data: result,
      message: '초대장 열람 성공',
      statusCode: 200,
    });
  }
}
