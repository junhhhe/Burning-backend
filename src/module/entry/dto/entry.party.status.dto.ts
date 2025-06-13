import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt } from 'class-validator';
import { PartyState } from '../../party/enum/party.state';

export class ReqeustUpdatePartyStateDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  partyId: number;

  @ApiProperty({ enum: PartyState, example: PartyState.CLOSE })
  @IsEnum(PartyState)
  partyState: PartyState;
}
