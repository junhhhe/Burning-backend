import { Injectable } from '@nestjs/common';
import PartyMemberRepository from '../../entry/repository/party.member.repository';
import NotificationRepository from '../repository/notification.repository';

@Injectable()
export default class EntryService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly partyMemberRepository: PartyMemberRepository,
  ) {}
}
