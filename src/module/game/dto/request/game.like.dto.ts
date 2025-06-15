import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RequestAddLikeDto {
  @ApiProperty({ example: 1, description: '파티 ID' })
  @IsNumber()
  partyId: number;

  @ApiProperty({ example: 1, description: '파티 멤버 ID' })
  @IsNumber()
  targetMemberId: number;
}
