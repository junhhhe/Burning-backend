import { Injectable, NotFoundException } from '@nestjs/common';
import PartyRepository from '../repository/party.repository';
import NotificationRepository from '../repository/notification.repository';
import ReviewRepository from '../repository/review.repository';
import TagRepository from '../repository/tag.repository';
import { RequestPartySaveDto } from '../dto/party.save.dto';
import User from '../../auth/domain/user.entity';
import Party from '../domain/party.entity';
import { RequestPartyUpdateDto } from '../dto/party.update.dto';
import Tag from '../domain/tag.entity';
import { In, Like } from 'typeorm';
import { ResponsePartyDto } from '../dto/response/party.response.dto';
import { ResponsePartyDetailDto } from '../dto/response/party.response.detail.dto';
import { InternalServerErrorException } from '../../../global/exception/customException';

@Injectable()
export default class PartyService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly partyRepository: PartyRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  /**
   * 파티 전체 조회
   */
  public async findAll(tag?: string): Promise<ResponsePartyDto[]> {
    const parties = await this.partyRepository.find({
      where: { isDeleted: false },
      relations: ['userId', 'tags', 'partyMembers'],
      order: { partyId: 'DESC' },
    });

    // 태그 필터링
    const filteredParties = tag
      ? parties.filter((party) => party.tags.some((t) => t.tag === tag))
      : parties;

    return filteredParties.map((party) => {
      const currentPersonnel = Array.isArray(party.partyMembers)
        ? party.partyMembers.filter((m) => !m.isDeleted).length
        : 0;

      return {
        partyId: party.partyId,
        partyImage: party.partyImage,
        title: party.title,
        location: party.location,
        partyDate: this.formatDate(party.partyDate),
        partyState: party.partyState,
        tags: party.tags.map((t) => `#${t.tag}`),
        host: party.userId.name,
        people: `${currentPersonnel}/${party.personnel}`,
      };
    });
  }

  /**
   * 파티 단일 조회
   */
  public async find(partyId: number): Promise<ResponsePartyDetailDto> {
    const party = await this.partyRepository.findOne({
      where: { partyId: partyId, isDeleted: false },
      relations: [
        'userId',
        'tags',
        'partyMembers',
        'likes',
        'messages',
        'reviews',
        'reviews.userId',
        'corrects',
        'notifications',
      ],
    });
    if (!party) {
      throw new NotFoundException('해당 파티를 찾을 수 없습니다.');
    }

    const reviews =
      party.reviews?.map((review) => ({
        reviewer: review.userId.name,
        createdAt: this.formatDate(review.createdDate),
        content: review.content,
        rating: review.rating,
      })) || [];

    const averageRating = reviews.length
      ? parseFloat(
          (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1),
        )
      : 0;

    return {
      partyId: party.partyId,
      partyImage: party.partyImage,
      title: party.title,
      content: party.content,
      location: party.location,
      partyDate: this.formatDate(party.partyDate),
      startDate: this.formatDate(party.startDate),
      endDate: this.formatDate(party.endDate),
      partyState: party.partyState,
      personnel: party.personnel,
      currentPersonnel: Array.isArray(party.partyMembers)
        ? party.partyMembers.filter((m) => !m.isDeleted).length
        : 0,
      tags: party.tags.map((t) => `#${t.tag}`),
      host: party.userId.name,
      reviews,
      averageRating,
      reviewCount: reviews.length,
    };
  }

  /**
   * 파티 생성
   */
  public async save(user: User, dto: RequestPartySaveDto): Promise<Party> {
    const tags = await this.findOrCreateTags(dto.tagNames);

    const party = this.partyRepository.create({
      ...dto,
      userId: user,
      tags,
    });

    return await this.partyRepository.save(party);
  }

  /**
   * 파티 수정
   */
  public async update(user: User, dto: RequestPartyUpdateDto): Promise<Party> {
    const party = await this.partyRepository.findOne({
      where: {
        partyId: dto.partyId,
        isDeleted: false,
        userId: { userId: user.userId },
      },
      relations: ['userId'],
    });
    if (!party) {
      throw new NotFoundException('파티를 찾을 수 없거나 권한이 없습니다.');
    }
    const tags = await this.findOrCreateTags(dto.tagNames);
    Object.assign(party, dto);
    return await this.partyRepository.save(party);
  }

  /**
   * 파티 삭제
   */
  public async delete(user: User, partyId: number): Promise<void> {
    const party = await this.partyRepository.findOne({
      where: {
        partyId,
        isDeleted: false,
        userId: user.userId as any,
      },
    });
    if (!party) {
      throw new NotFoundException('파티를 찾을 수 없거나 권한이 없습니다.');
    }
    party.isDeleted = true;
    party.deletedDate = new Date();
    await this.partyRepository.save(party);
  }

  /**
   * 태그 검색
   */
  public async search(keyword: string): Promise<Tag[]> {
    const cleanKeyword = typeof keyword === 'string' ? keyword.trim() : '';
    if (!cleanKeyword) return [];

    return await this.tagRepository.find({
      where: {
        tag: Like(`%${cleanKeyword}%`),
        isDeleted: false,
      },
      take: 10,
    });
  }

  /**
   * 태그 추가
   */
  private async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const uniqueNames = [...new Set(tagNames)];
    const existingTags = await this.tagRepository.find({
      where: { tag: In(uniqueNames) },
    });

    const existingTagNames = existingTags.map((t) => t.tag);
    const newTags = uniqueNames
      .filter((name) => !existingTagNames.includes(name))
      .map((name) => this.tagRepository.create({ tag: name }));

    if (newTags.length) await this.tagRepository.save(newTags);

    return [...existingTags, ...newTags];
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 16).replace('T', ' ');
  }
}
