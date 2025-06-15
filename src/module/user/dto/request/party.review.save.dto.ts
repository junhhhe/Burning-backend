import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class RequestReviewSaveDto {
  @ApiProperty({ example: 1, description: '리뷰를 작성할 파티 ID' })
  @IsInt()
  partyId: number;

  @ApiProperty({ example: '정말 재밌었어요!', description: '리뷰 내용' })
  @IsString()
  content: string;

  @ApiProperty({ example: 5, description: '별점 (1~5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
