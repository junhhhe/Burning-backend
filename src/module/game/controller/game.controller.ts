import { Controller } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { createServerExceptionResponse } from '../../../global/response/common';
import GameService from '../service/game.service';

@ApiTags('Game')
@ApiResponse(createServerExceptionResponse())
@Controller({ path: '/game', version: '1' })
export default class GameController {
  constructor(private readonly gameService: GameService) {}
}
