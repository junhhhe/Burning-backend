import { IsInt } from 'class-validator';

export class RequestSubmitAnswerDto {
  @IsInt()
  partyId: number;

  @IsInt()
  targetMemberId: number;
}
