import { Injectable } from '@nestjs/common';
import PartyRepository from '../repository/party.repository';
import NotificationRepository from '../repository/notification.repository';
import ReviewRepository from '../repository/review.repository';
import TagRepository from '../repository/tag.repository';

@Injectable()
export default class PartyService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly partyRepository: PartyRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly tagRepository: TagRepository,
  ) {}
}
