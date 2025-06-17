import { Request } from 'express';
import User from '../../module/auth/domain/user.entity';

export interface RequestWithUsernDto extends Request {
  user: User;
}
