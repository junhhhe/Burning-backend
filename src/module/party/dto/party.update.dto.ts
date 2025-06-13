import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PartyState } from '../enum/party.state';

export class RequestPartyUpdateDto {
  @ApiPropertyOptional({ description: '파티 ID', example: 1 })
  @IsInt()
  partyId: number;

  @ApiPropertyOptional({
    description: '파티 제목',
    maxLength: 100,
    example: '주말 등산 모임',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    description: '파티 설명',
    maxLength: 255,
    example: '남산 등산 함께 가실 분 구합니다.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  content?: string;

  @ApiPropertyOptional({
    description: '썸네일 이미지 URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  partyImage?: string;

  @ApiPropertyOptional({
    description: '파티 일시',
    type: String,
    format: 'date-time',
    example: '2025-07-20T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  partyDate?: Date;

  @ApiPropertyOptional({ description: '파티 장소', example: '서울 남산입구' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: '파티 상태',
    enum: PartyState,
    example: PartyState.OPEN,
  })
  @IsOptional()
  @IsEnum(PartyState)
  partyState?: PartyState;

  @ApiPropertyOptional({ description: '모집 인원 수', example: 5 })
  @IsOptional()
  @IsInt()
  personnel?: number;

  @ApiPropertyOptional({
    description: '파티 시작일',
    type: String,
    format: 'date-time',
    example: '2025-07-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({
    description: '파티 마감일',
    type: String,
    format: 'date-time',
    example: '2025-07-15',
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({
    example: ['친목', '등산', '주말'],
    description: '파티에 연결할 태그 목록입니다. 중복은 제거됩니다.',
  })
  @IsArray()
  @IsString({ each: true })
  tagNames: string[];
}
