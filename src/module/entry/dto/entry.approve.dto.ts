import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt } from 'class-validator';

export class RequestPartyMemberApproveDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  partyMemberId: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  approval: boolean;
}
