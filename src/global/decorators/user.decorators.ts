import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from '../../module/auth/domain/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);