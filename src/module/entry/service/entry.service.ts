import { Injectable } from '@nestjs/common';
import PartyMemberRepository from '../../entry/repository/party.member.repository';
import NotificationRepository from '../repository/notification.repository';
import {
  BadRequestException,
  NotFoundException,
} from '../../../global/exception/customException';
import User from '../../auth/domain/user.entity';
import { RequestEntryApplyDto } from '../dto/entry.dto';
import PartyRepository from '../../party/repository/party.repository';
import { RequestPartyMemberApproveDto } from '../dto/entry.approve.dto';
import { ReqeustUpdatePartyStateDto } from '../dto/entry.party.status.dto';
import { RequestInvitationDto } from '../dto/entry.invite.dto';
import { SocketGateway } from '../../../global/socket/gateway/gateway.socket';

@Injectable()
export default class EntryService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly partyMemberRepository: PartyMemberRepository,
    private readonly partyRepository: PartyRepository,
    private readonly socketGateway: SocketGateway,
  ) {}

  /**
   * 파티 신청
   */
  public async apply(user: User, dto: RequestEntryApplyDto): Promise<void> {
    const party = await this.partyRepository.findOne({
      where: {
        partyId: dto.partyId,
        isDeleted: false,
      },
    });
    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다.');
    }

    const existing = await this.partyMemberRepository.findOne({
      where: {
        partyId: dto.partyId as any,
        userId: user.userId as any,
      },
      withDeleted: true, // soft-delete 레코드도 포함 조회
    });

    if (existing) {
      if (!existing.isDeleted) {
        throw new BadRequestException('이미 신청한 파티입니다.');
      }

      // 기존 신청 복구 처리
      existing.isDeleted = false;
      existing.detail = dto.detail;
      existing.nickname = dto.nickname;
      existing.hobby = dto.hobby;
      existing.mbti = dto.mbti;
      existing.profileImage = dto.profileImage;
      await this.partyMemberRepository.save(existing);
      return;
    }

    const member = this.partyMemberRepository.create({
      ...dto,
      partyId: party,
      userId: user,
    });

    await this.partyMemberRepository.save(member);
  }

  /**
   * 파티 신청 취소
   */
  public async cancel(user: User, partyId: number): Promise<void> {
    const partyMember = await this.partyMemberRepository.findOne({
      where: {
        userId: user.userId as any,
        partyId: partyId as any,
        isDeleted: false,
      },
      relations: ['partyId', 'userId'],
    });

    if (!partyMember) {
      throw new NotFoundException('신청 정보를 찾을 수 없습니다.');
    }

    partyMember.isDeleted = true;
    await this.partyMemberRepository.save(partyMember);
  }

  /**
   * 파티 신청자 조회
   */
  public async findApplicants(user: User, partyId: number): Promise<any[]> {
    const party = await this.partyRepository.findOne({
      where: {
        partyId: partyId,
        isDeleted: false,
      },
      relations: ['userId'],
    });

    if (!party) {
      throw new NotFoundException('파티가 존재하지 않습니다.');
    }

    if (party.userId.userId !== user.userId) {
      throw new BadRequestException(
        '해당 파티의 주최자만 신청자를 조회할 수 있습니다.',
      );
    }

    const partyMembers = await this.partyMemberRepository.find({
      where: {
        partyId: partyId as any,
        isDeleted: false,
      },
      relations: ['userId'],
      order: { createdDate: 'ASC' },
    });

    return partyMembers.map((member) => ({
      name: member.userId.name,
      email: member.userId.username,
      instargram: member.userId.instargram,
      birth: member.userId.birth,
      approval: member.approval,
    }));
  }

  /**
   * 파티 신청자 승인/거절
   */
  public async approveMember(
    user: User,
    dto: RequestPartyMemberApproveDto,
  ): Promise<void> {
    const partyMember = await this.partyMemberRepository.findOne({
      where: {
        partyMemberId: dto.partyMemberId,
        isDeleted: false,
      },
      relations: ['partyId'],
    });

    if (!partyMember) {
      throw new NotFoundException('신청자를 찾을 수 없습니다.');
    }

    const party = await this.partyRepository.findOne({
      where: {
        partyId: partyMember.partyId.partyId,
      },
      relations: ['userId'],
    });

    if (!party || party.userId.userId !== user.userId) {
      throw new BadRequestException('파티 주최자만 승인/거절할 수 있습니다.');
    }

    partyMember.approval = dto.approval;
    await this.partyMemberRepository.save(partyMember);
  }

  /**
   * 파티 모집/마감 상태 변경
   */
  public async updatePartyState(
    user: User,
    dto: ReqeustUpdatePartyStateDto,
  ): Promise<void> {
    const party = await this.partyRepository.findOne({
      where: {
        partyId: dto.partyId,
        isDeleted: false,
      },
      relations: ['userId'],
    });

    if (!party) {
      throw new NotFoundException('파티를 찾을 수 없습니다.');
    }

    if (party.userId.userId !== user.userId) {
      throw new BadRequestException('모집 상태 변경 권한이 없습니다.');
    }

    party.partyState = dto.partyState;
    await this.partyRepository.save(party);
  }

  /**
   * 파티 초대장 전송
   */
  public async sendInvitations(
    user: User,
    dto: RequestInvitationDto,
  ): Promise<any[]> {
    console.log(dto.partyId);
    const party = await this.partyRepository.findOne({
      where: {
        partyId: dto.partyId,
        isDeleted: false,
      },
      relations: ['userId'],
    });

    if (!party) throw new NotFoundException('파티를 찾을 수 없습니다.');

    if (party.userId.userId !== user.userId) {
      throw new BadRequestException('초대장 발송 권한이 없습니다.');
    }

    const approvedMembers = await this.partyMemberRepository.find({
      where: {
        partyId: dto.partyId as any,
        approval: true,
        isDeleted: false,
      },
      relations: ['userId'],
    });

    const send = [];

    for (const member of approvedMembers) {
      const exists = await this.notificationRepository.findOne({
        where: {
          partyId: dto.partyId as any,
          userId: member.userId.userId as any,
          isDeleted: false,
        },
      });

      if (!exists) {
        const notification = this.notificationRepository.create({
          partyId: party,
          userId: member.userId,
          content: dto.content,
        });
        await this.notificationRepository.save(notification);

        send.push({
          name: member.userId.name,
          email: member.userId.username,
          content: dto.content,
        });

        this.socketGateway.sendNotificationToUser(member.userId.userId, {
          message: `${party.title} 파티 초대장이 도착했습니다.`,
          url: `/party/${dto.partyId}`,
          type: 'INVITE',
        });
      }
    }
    return send;
  }

  /**
   * 초대장 열람
   */
  public async readInvitation(
    user: User,
    notificationId: number,
  ): Promise<any> {
    const notification = await this.notificationRepository.findOne({
      where: {
        notificationId: notificationId,
        userId: user.userId as any,
        isDeleted: false,
      },
      relations: ['partyId'],
    });

    if (!notification) {
      throw new BadRequestException('해당 초대장을 열람할 수 없습니다.');
    }

    if (notification.userId.userId !== user.userId) {
      throw new BadRequestException('초대장 열람 권한이 없습니다.');
    }

    return {
      partyId: notification.partyId.partyId,
      title: notification.partyId.title,
      location: notification.partyId.location,
      partyDate: notification.partyId.partyDate,
      content: notification.content,
    };
  }
}
