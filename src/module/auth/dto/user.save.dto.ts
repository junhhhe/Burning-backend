// ** Swagger Imports
import { ApiProperty } from '@nestjs/swagger';

// ** Pipe Imports
import { IsBoolean, IsDate, IsEnum, IsString } from 'class-validator';
import { Gender } from '../enum/gender.enum';
import { Type } from 'class-transformer';

export default class RequestUserSaveDto {
  @ApiProperty({
    example: 'qwer@gmail.com',
    description: '사용자 아이디',
    maxLength: 100,
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: '1234',
    description: '비밀번호',
    maxLength: 120,
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: '홍길동',
    description: '사용자 이름',
    maxLength: 50,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '1990-01-01',
    description: '생년월일',
  })
  @Type(() => Date)
  @IsDate()
  birth: Date;

  @ApiProperty({
    example: 'insta_user_01',
    description: '인스타그램 아이디',
  })
  @IsString()
  instargram: string;

  @ApiProperty({
    example: '남',
    enum: Gender,
    description: '성별 (남 | 여)',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    example: true,
    description: '개인정보 동의 여부',
  })
  @IsBoolean()
  agreement: boolean;
}
