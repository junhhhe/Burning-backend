import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class RequestStartGameDto {
  @ApiProperty({ example: 1, description: '파티 ID' })
  @IsInt()
  partyId: number;

  @ApiProperty({ example: 5, description: '게임 시간(분)' })
  @IsPositive()
  gameTime: number;
}
