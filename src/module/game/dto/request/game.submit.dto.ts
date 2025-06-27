import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class RequestSubmitAnswerDto {
  @ApiProperty({ example: 1, description: '파티 ID' })
  @IsInt()
  partyId: number;

  @ApiProperty({ example: 1, description: '답안을 제출할 대상 멤버 ID' })
  @IsInt()
  targetMemberId: number;
}
