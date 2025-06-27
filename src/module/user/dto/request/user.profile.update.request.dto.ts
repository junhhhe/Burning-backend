import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class RequestProfileUpdateDto {
  @ApiProperty({ example: 'user.name+test@example-domain.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '이름' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '인스타 계정' })
  @IsOptional()
  @IsString()
  instargram?: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birth?: string;
}
