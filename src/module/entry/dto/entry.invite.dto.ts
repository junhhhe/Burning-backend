import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class RequestInvitationDto {
  @ApiProperty({ example: 4, description: '파티 ID' })
  @IsInt()
  partyId: number;

  @ApiProperty({
    example: '안녕하세요! 파티에 초대합니다.',
    description: '초대장 내용',
  })
  @IsString()
  content: string;
}
