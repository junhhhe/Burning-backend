import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class RequestProfileUpdateDto {
  @ApiProperty({ example: '이메일' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '이름' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '인스타 계정' })
  @IsOptional()
  @IsString()
  instargram?: string;

  @ApiProperty({ example: '생년월일' })
  @IsOptional()
  @IsDateString()
  birth?: string;
}
