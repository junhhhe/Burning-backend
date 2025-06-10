// ** Swagger Imports
import { ApiProperty } from '@nestjs/swagger';

// ** Pipe Imports
import { IsString } from 'class-validator';

export default class RequestAdminSaveDto {
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
}
