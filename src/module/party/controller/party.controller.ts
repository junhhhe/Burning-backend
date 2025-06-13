import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createServerExceptionResponse } from '../../../global/response/common';
import PartyService from '../service/party.service';
import JwtAccessGuard from '../../auth/passport/auth.jwt-access.guard';
import { GetUser } from '../../../global/decorators/user.decorators';
import User from '../../auth/domain/user.entity';
import { RequestPartySaveDto } from '../dto/party.save.dto';
import CommonResponse from '../../../global/dto/common.response';
import { RequestPartyUpdateDto } from '../dto/party.update.dto';
import { PartyResponse } from '../../../global/response/party.response';
import { BadRequestException } from '../../../global/exception/customException';

@ApiTags('Party')
@ApiResponse(createServerExceptionResponse())
@UseGuards(JwtAccessGuard)
@Controller({ path: '/party', version: '1' })
export default class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @ApiOperation({ summary: '태그 조회' })
  @Get('/tag')
  public async searchTags(@Query('keyword') keyword?: string) {
    const clean = typeof keyword === 'string' ? keyword.trim() : '';
    if (!clean) {
      throw new BadRequestException('keyword 쿼리 파라미터가 필요합니다.');
    }

    const tags = await this.partyService.search(clean);
    return CommonResponse.createResponse({
      data: tags.map((tag) => tag.tag),
      statusCode: 200,
      message: '태그 검색에 성공했습니다.',
    });
  }

  @ApiOperation({ summary: '파티 태그 전체 조회' })
  @ApiResponse(PartyResponse.findAll[200])
  @ApiResponse(PartyResponse.findAll[404])
  @Get('/')
  public async findAllParty(@Query('tag') tag: string) {
    const party = await this.partyService.findAll(tag);
    return CommonResponse.createResponse({
      data: party,
      message: '파티 조회 완료',
      statusCode: 200,
    });
  }

  @ApiOperation({ summary: '파티 단일 조회' })
  @ApiResponse(PartyResponse.find[200])
  @ApiResponse(PartyResponse.find[404])
  @Get('/:partyId')
  public async findParty(@Param('partyId') partyId: number) {
    const party = await this.partyService.find(partyId);
    return CommonResponse.createResponse({
      data: party,
      message: '파티 조회 완료',
      statusCode: 200,
    });
  }

  @ApiOperation({ summary: '파티 생성' })
  @ApiBody({ type: RequestPartySaveDto })
  @ApiResponse(PartyResponse.save[201])
  @ApiResponse(PartyResponse.save[400])
  @Post('/save')
  public async saveParty(
    @GetUser() user: User,
    @Body() dto: RequestPartySaveDto,
  ) {
    const party = await this.partyService.save(user, dto);
    return CommonResponse.createResponse({
      data: party,
      message: '파티가 생성되었습니다.',
      statusCode: 201,
    });
  }

  @ApiOperation({ summary: '파티 수정' })
  @ApiBody({ type: RequestPartyUpdateDto })
  @ApiResponse(PartyResponse.update[200])
  @ApiResponse(PartyResponse.update[404])
  @Patch('/')
  public async updateParty(
    @GetUser() user: User,
    @Body() dto: RequestPartyUpdateDto,
  ) {
    const party = await this.partyService.update(user, dto);
    return CommonResponse.createResponse({
      data: party,
      message: '파티가 성공적으로 수정되었습니다.',
      statusCode: 200,
    });
  }

  @ApiOperation({ summary: '파티 삭제' })
  @ApiResponse(PartyResponse.delete[200])
  @ApiResponse(PartyResponse.delete[404])
  @Delete('/:partyId')
  public async deleteParty(
    @Param('partyId') partyId: number,
    @GetUser() user: User,
  ) {
    await this.partyService.delete(user, partyId);
    return CommonResponse.createResponseMessage({
      message: '파티가 성공적으로 삭제되었습니다.',
      statusCode: 200,
    });
  }
}
