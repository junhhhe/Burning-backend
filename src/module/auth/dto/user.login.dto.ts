// ** Swagger Imports
import { ApiProperty } from '@nestjs/swagger';

// ** Pipe Imports
import { IsString } from 'class-validator';
export default class RequestUserLoginDto {
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
}
