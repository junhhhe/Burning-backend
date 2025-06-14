import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class RequestSaveMessageDto {
  @ApiProperty({ example: 1, description: '파티 ID' })
  @IsNumber()
  partyId: number;

  @ApiProperty({ example: 1, description: '받는 멤버 ID' })
  @IsNumber()
  partyMemberId: number;

  @ApiProperty({ example: '안녕하세요', description: '쪽지 내용' })
  @IsString()
  @MaxLength(100)
  content: string;
}
