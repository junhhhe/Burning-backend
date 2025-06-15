import { Injectable } from '@nestjs/common';
import UserRepository from '../../auth/repository/user.repository';
import PartyRepository from '../../party/repository/party.repository';
import ReviewRepository from '../../party/repository/review.repository';
import User from '../../auth/domain/user.entity';
import PartyMemberRepository from '../../entry/repository/party.member.repository';
import { ResponseUserPartyDto } from '../dto/response/user.party.response.dto';
import { ResponseMyReviewDto } from '../dto/response/user.party.review.response.dto';
import {
  BadRequestException,
  NotFoundException,
} from '../../../global/exception/customException';
import { RequestProfileUpdateDto } from '../dto/request/user.profile.update.request.dto';
import { RequestReviewSaveDto } from '../dto/request/party.review.save.dto';

@Injectable()
export default class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly partyRepository: PartyRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly partyMemberRepository: PartyMemberRepository,
  ) {}

  /**
   * 내가 주최한 파티 조회
   */
  public async getHostParty(user: User): Promise<ResponseUserPartyDto[]> {
    const parties = await this.partyRepository.find({
      where: {
        userId: user.userId as any,
      },
      relations: ['tags', 'partyMembers', 'userId'],
      order: { startDate: 'ASC' },
    });

    return parties.map((party) => {
      const memberCount = Array.isArray(party.partyMembers)
        ? party.partyMembers.length
        : 0;

      const personnel = `${memberCount}/${party.personnel}`;

      return {
        partyId: party.partyId,
        title: party.title,
        location: party.location,
        startDate: party.startDate,
        partyImage: party.partyImage,
        state: party.partyState,
        tags: party.tags.map((tag) => tag.tag),
        personnel,
        hostName: party.userId.name,
      };
    });
  }

  /**
   * 내가 참여한 파티 조회
   */
  public async getJoinParty(user: User): Promise<ResponseUserPartyDto[]> {
    const joinedMembers = await this.partyMemberRepository.find({
      where: {
        userId: user.userId as any,
        isDeleted: false,
        approval: true,
      },
      relations: [
        'partyId',
        'partyId.userId',
        'partyId.tags',
        'partyId.partyMembers',
      ],
    });

    return joinedMembers.map((member) => {
      const party = member.partyId;
      const memberCount = Array.isArray(party.partyMembers)
        ? party.partyMembers.length
        : 0;

      const personnel = `${memberCount}/${party.personnel}`;

      return {
        partyId: party.partyId,
        title: party.title,
        location: party.location,
        startDate: party.startDate,
        partyImage: party.partyImage,
        state: party.partyState,
        tags: party.tags.map((tag) => tag.tag),
        personnel,
        hostName: party.userId.name,
      };
    });
  }

  /**
   * 내가 작성한 리뷰 조회
   */
  public async getMyReviews(user: User): Promise<ResponseMyReviewDto[]> {
    const reviews = await this.reviewRepository.find({
      where: {
        userId: user.userId as any,
        isDeleted: false,
      },
      relations: ['partyId'],
      order: { createdDate: 'DESC' },
    });

    return reviews.map((review) => ({
      partyId: review.partyId.partyId,
      partyTitle: review.partyId.title,
      content: review.content,
      rating: review.rating,
      createdAt: review.createdDate.toISOString().split('T')[0],
    }));
  }

  /**
   * 내 프로필 조회
   */
  public async getProfile(user: User) {
    const profile = await this.userRepository.findOne({
      where: {
        userId: user.userId,
      },
    });
    return {
      email: user.username,
      name: user.name,
      instagram: user.instargram,
      birth: user.birth,
    };
  }

  /**
   * 내 프로필 수정
   */
  public async updateProfile(user: User, dto: RequestProfileUpdateDto) {
    const profile = await this.userRepository.findOne({
      where: {
        userId: user.userId,
      },
    });
    if (!profile) throw new NotFoundException('유저를 찾을 수 없습니다.');

    const updateProfile = this.userRepository.create({
      userId: user.userId,
      username: dto.email ?? user.username,
      name: dto.name ?? user.name,
      instargram: dto.instargram ?? user.instargram,
      birth: dto.birth ? new Date(dto.birth) : user.birth,
    });

    const updated = await this.userRepository.save(updateProfile);

    return {
      email: updated.username,
      name: updated.name,
      instagram: updated.instargram,
      birth: updated.birth,
    };
  }

  /**
   * 리뷰 등록
   */
  public async addReview(user: User, dto: RequestReviewSaveDto): Promise<void> {
    const member = await this.partyMemberRepository.findOne({
      where: {
        userId: user.userId as any,
        partyId: dto.partyId as any,
        approval: true,
        isDeleted: false,
      },
    });

    if (!member) {
      throw new BadRequestException('파티에 참여하지 않았습니다.');
    }

    const existing = await this.reviewRepository.findOne({
      where: {
        userId: user.userId as any,
        partyId: dto.partyId as any,
        isDeleted: false,
      },
    });

    if (existing) {
      throw new BadRequestException('이미 리뷰를 작성하였습니다.');
    }

    const review = this.reviewRepository.create({
      userId: user,
      partyId: dto.partyId as any,
      content: dto.content,
      rating: dto.rating,
      isDeleted: false,
    });

    await this.reviewRepository.save(review);
  }
}
