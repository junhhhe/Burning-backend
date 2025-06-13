import { Controller } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { createServerExceptionResponse } from '../../../global/response/common';
import EntryService from '../service/entry.service';

@ApiTags('Entry')
@ApiResponse(createServerExceptionResponse())
@Controller({ path: '/entry', version: '1' })
export default class EntryController {
  constructor(private readonly entryService: EntryService) {}
}
