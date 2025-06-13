import { Injectable } from '@nestjs/common';
import CorrectRepository from '../repository/correct.repository';
import LikeRepository from '../repository/like.repository';
import MessageRepository from '../repository/message.repository';

@Injectable()
export default class GameService {
  constructor(
    private readonly correctRepository: CorrectRepository,
    private readonly likeRepository: LikeRepository,
    private readonly messageRepository: MessageRepository,
  ) {}
}
