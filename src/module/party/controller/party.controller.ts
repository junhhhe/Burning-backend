import { Controller } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { createServerExceptionResponse } from '../../../global/response/common';
import PartyService from '../service/party.service';

@ApiTags('Party')
@ApiResponse(createServerExceptionResponse())
@Controller({ path: '/party', version: '1' })
export default class PartyController {
  constructor(private readonly partyService: PartyService) {}
}
