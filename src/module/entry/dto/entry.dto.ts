import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class RequestEntryApplyDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  partyId: number;

  @ApiProperty({ example: '간단한 자기소개입니다.' })
  @IsString()
  detail: string;

  @ApiProperty({ example: '문짱' })
  @IsString()
  nickname: string;

  @ApiProperty({ example: '등산' })
  @IsString()
  hobby: string;

  @ApiProperty({ example: 'INTP' })
  @IsString()
  mbti: string;

  @ApiProperty({ example: 'https://img.url/profile.jpg' })
  @IsString()
  profileImage: string;
}
