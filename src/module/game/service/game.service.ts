import { Injectable } from '@nestjs/common';
import CorrectRepository from '../repository/correct.repository';
import LikeRepository from '../repository/like.repository';
import MessageRepository from '../repository/message.repository';
import User from '../../auth/domain/user.entity';
import PartyMemberRepository from '../../entry/repository/party.member.repository';
import {
  BadRequestException,
  NotFoundException,
} from '../../../global/exception/customException';
import { ResponseAnonymousProfileDto } from '../dto/response/game.anonymous.profile.response.dto';
import { Gender } from '../../auth/enum/gender.enum';
import PartyRepository from '../../party/repository/party.repository';
import { RequestSubmitAnswerDto } from '../dto/request/game.submit.dto';
import { ResponseRealProfileDto } from '../dto/response/game.real.profile.response';
import { ResponseCorrectStatsDto } from '../dto/response/game.correct.response';
import { ResponseApprovedMemberDto } from '../dto/response/game.approve.response.dto';
import { RequestAddLikeDto } from '../dto/request/game.like.dto';

@Injectable()
export default class GameService {
  constructor(
    private readonly correctRepository: CorrectRepository,
    private readonly likeRepository: LikeRepository,
    private readonly messageRepository: MessageRepository,
    private readonly partyMemberRepository: PartyMemberRepository,
    private readonly partyRepository: PartyRepository,
  ) {}

  /**
   * 합격자 조회
   */
  public async getApprovedMembers(
    user: User,
    partyId: number,
  ): Promise<{
    MALE: ResponseApprovedMemberDto[];
    FEMALE: ResponseApprovedMemberDto[];
  }> {
    const party = await this.partyRepository.findOne({
      where: {
        partyId: partyId,
        isDeleted: false,
      },
      relations: ['userId'],
    });

    if (!party || party.userId.userId !== user.userId) {
      throw new BadRequestException('조회 권한이 없습니다.');
    }

    const approvedMembers = await this.partyMemberRepository.find({
      where: {
        partyId: partyId as any,
        approval: true,
        isDeleted: false,
      },
      relations: ['userId', 'likes'],
    });

    const grouped = {
      MALE: [] as ResponseApprovedMemberDto[],
      FEMALE: [] as ResponseApprovedMemberDto[],
    };

    for (const member of approvedMembers) {
      const dto: ResponseApprovedMemberDto = {
        userId: member.userId.userId,
        name: member.userId.name,
        profileImage: member.profileImage,
        likeCount: member.likes?.length || 0,
      };

      if (member.userId.gender === Gender.MALE) {
        grouped.MALE.push(dto);
      } else {
        grouped.FEMALE.push(dto);
      }
    }

    grouped.MALE.sort((a, b) => b.likeCount - a.likeCount);
    grouped.FEMALE.sort((a, b) => b.likeCount - a.likeCount);

    return grouped;
  }

  /**
   * 게임 시작 시 익명 프로필 배정
   */
  public async startGame(user: User, partyId: number): Promise<void> {
    const party = await this.partyRepository.findOne({
      where: {
        partyId: partyId,
        isDeleted: false,
      },
      relations: ['userId'],
    });

    if (!party) {
      throw new NotFoundException('파티를 찾을 수 없습니다.');
    }

    if (party.userId.userId !== user.userId) {
      throw new BadRequestException('파티의 주최자가 아닙니다.');
    }

    const partyMembers = await this.partyMemberRepository.find({
      where: {
        partyId: partyId as any,
        approval: true,
        isDeleted: false,
      },
      relations: ['userId'],
    });

    for (const member of partyMembers) {
      const myGender = member.userId.gender;
      const candidates = partyMembers.filter(
        (other) =>
          other.userId.userId !== member.userId.userId &&
          other.userId.gender !== myGender,
      );

      if (!candidates.length) continue;

      const randomTarget =
        candidates[Math.floor(Math.random() * candidates.length)];

      const correct = this.correctRepository.create({
        userId: member.userId,
        partyId: party,
        correctMemberId: randomTarget,
        answer: false,
        isDeleted: false,
      });

      await this.correctRepository.save(correct);
    }
  }

  /**
   * 익명 프로필 제공 - 특정 사용자에게만 해당
   */
  public async getRandomProfile(
    user: User,
    partyId: number,
  ): Promise<ResponseAnonymousProfileDto> {
    const assigned = await this.correctRepository.findOne({
      where: {
        partyId: partyId as any,
        userId: user.userId as any,
        isDeleted: false,
      },
      relations: ['correctMemberId'],
    });

    if (!assigned)
      throw new BadRequestException('익명 프로필이 할당되지 않았습니다.');

    const target = assigned.correctMemberId;

    return {
      partyMemberId: target.partyMemberId,
      nickname: target.nickname,
      hobby: target.hobby,
      mbti: target.mbti,
      detail: target.detail,
    };
  }

  /**
   * 정답 제출
   */
  public async submitAnswer(
    user: User,
    dto: RequestSubmitAnswerDto,
  ): Promise<void> {
    const partyMember = await this.partyMemberRepository.findOne({
      where: {
        userId: user.userId as any,
        partyId: dto.partyId as any,
        approval: true,
        isDeleted: false,
      },
      relations: ['userId', 'partyId'],
    });

    if (!partyMember) {
      throw new BadRequestException('당신은 이 파티의 참여자가 아닙니다.');
    }

    const existingCorrect = await this.correctRepository.findOne({
      where: {
        userId: user.userId as any,
        partyId: dto.partyId as any,
      },
      relations: ['correctMemberId', 'targetMemberId'],
    });

    if (!existingCorrect) {
      throw new NotFoundException('게임이 시작되지 않았거나 할당이 없습니다.');
    }

    if (existingCorrect.targetMemberId) {
      throw new BadRequestException('이미 정답을 제출하였습니다.');
    }

    const targetMember = await this.partyMemberRepository.findOne({
      where: {
        partyMemberId: dto.targetMemberId,
      },
    });

    if (!targetMember) {
      throw new NotFoundException('제출 대상이 존재하지 않습니다.');
    }

    // 정답 여부 확인
    const isCorrect =
      existingCorrect.correctMemberId.partyMemberId === dto.targetMemberId;

    existingCorrect.targetMemberId = targetMember;
    existingCorrect.answer = isCorrect;

    await this.correctRepository.save(existingCorrect);
  }

  /**
   * 익명 프로필 실명 확인
   */
  public async revealProfileOwner(
    user: User,
    partyId: number,
  ): Promise<ResponseRealProfileDto> {
    const correct = await this.correctRepository.findOne({
      where: {
        partyId: partyId as any,
        userId: user.userId as any,
        isDeleted: false,
      },
      relations: ['correctMemberId', 'correctMemberId.userId'],
    });

    if (!correct) {
      throw new NotFoundException('해당 유저의 익명 프로필 정보가 없습니다.');
    }

    return {
      correctMemberId: correct.correctMemberId.partyMemberId,
      name: correct.correctMemberId.userId.name,
      profileImage: correct.correctMemberId.profileImage,
    };
  }

  /**
   * 정답 통계 조회 (주최자용)
   */
  public async getCorrectAnswers(
    user: User,
    partyId: number,
  ): Promise<{
    total: number;
    grouped: {
      MALE: ResponseCorrectStatsDto[];
      FEMALE: ResponseCorrectStatsDto[];
    };
  }> {
    const party = await this.partyRepository.findOne({
      where: {
        partyId: partyId,
        isDeleted: false,
      },
      relations: ['userId'],
    });

    if (!party || party.userId.userId !== user.userId) {
      throw new BadRequestException('정답자 조회 권한이 없습니다.');
    }

    const corrects = await this.correctRepository.find({
      where: {
        partyId: partyId as any,
        isDeleted: false,
        answer: true,
      },
      relations: ['userId'],
    });

    const grouped = {
      MALE: [] as ResponseCorrectStatsDto[],
      FEMALE: [] as ResponseCorrectStatsDto[],
    };

    for (const correct of corrects) {
      const user = correct.userId;
      if (!user || !user.gender) continue;

      const profile: ResponseCorrectStatsDto = {
        name: user.name,
        userId: user.userId,
      };

      if (user.gender === Gender.MALE) {
        grouped.MALE.push(profile);
      } else if (user.gender === Gender.FEMALE) {
        grouped.FEMALE.push(profile);
      }
    }

    return {
      total: corrects.length,
      grouped,
    };
  }

  /**
   * 멤버 좋아요
   */
  public async addLike(user: User, dto: RequestAddLikeDto): Promise<void> {
    const userPartyMember = await this.partyMemberRepository.findOne({
      where: {
        userId: user.userId as any,
        partyId: dto.partyId as any,
        approval: true,
        isDeleted: false,
      },
      relations: ['userId'],
    });

    if (!userPartyMember) {
      throw new BadRequestException('승인된 파티 멤버가 아닙니다.');
    }

    if (userPartyMember.partyMemberId === dto.targetMemberId) {
      throw new BadRequestException(
        '자기 자신에게는 좋아요를 누를 수 없습니다.',
      );
    }

    const target = await this.partyMemberRepository.findOne({
      where: {
        partyMemberId: dto.targetMemberId,
        isDeleted: false,
      },
    });

    if (!target) {
      throw new NotFoundException('대상 멤버가 존재하지 않습니다.');
    }

    const existing = await this.likeRepository.findOne({
      where: {
        userId: user.userId as any,
        partyId: dto.partyId as any,
        partyMemberId: dto.targetMemberId as any,
      },
    });

    if (existing) {
      throw new BadRequestException('이미 좋아요를 보냈습니다.');
    }

    const like = this.likeRepository.create({
      userId: user,
      partyId: dto.partyId as any,
      partyMemberId: target,
    });

    await this.likeRepository.save(like);
  }
}
