import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PartyState } from '../enum/party.state';

export class RequestPartySaveDto {
  @ApiProperty({ example: '파티 이미지 URL' })
  @IsString()
  partyImage: string;

  @ApiProperty({ example: '파티 제목' })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: '파티 설명' })
  @IsString()
  @MaxLength(255)
  content: string;

  @ApiProperty({ example: '2025-07-01' })
  @IsDateString()
  partyDate: Date;

  @ApiProperty({ example: '서울 강남구' })
  @IsString()
  location: string;

  @ApiProperty({ enum: PartyState, example: PartyState.OPEN })
  @IsEnum(PartyState)
  partyState: PartyState;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  personnel: number;

  @ApiProperty({ example: '2025-06-15' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2025-06-25' })
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    example: ['친목', '등산', '주말'],
    description: '파티에 연결할 태그 목록입니다. 중복은 제거됩니다.',
  })
  @IsArray()
  @IsString({ each: true })
  tagNames: string[];
}
