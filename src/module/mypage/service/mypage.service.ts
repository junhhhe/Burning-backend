import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Party from '../../party/domain/party.entity';
import Review from '../../party/domain/review.entity';
import User from '../../auth/domain/user.entity';


import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class MypageService {
  constructor(
    @InjectRepository(Party)
    private readonly partyRepository: Repository<Party>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ 내가 주최한 파티 조회
  async getHostedParties(userId: number) {
  return this.partyRepository.find({
    where: {
      userId: { userId },
    },
    relations: ['userId'],
  });
}

  // ✅ 내가 참여한 파티 조회
  async getJoinedParties(userId: number) {
    return this.partyRepository
      .createQueryBuilder('party')
      .leftJoin('party.participants', 'participant')
      .where('participant.id = :userId', { userId })
      .getMany();
  }

  // ✅ 내가 쓴 리뷰 조회
  async getMyReviews(userId: number) {
    return this.reviewRepository.find({
      where: { userId: { userId } },
      relations: ['party', 'userId'],
    });
  }

  // ✅ 내 프로필 조회
  async getProfile(userId: number) {
  const user = await this.userRepository.findOne({
    where: { userId: userId },
  });
  return {
    email: user.username,
    name: user.name,
    instagram: user.instargram, 
    birth: user.birth,
  };
}


  // ✅ 내 프로필 수정
  async updateProfile(userId: number, dto: UpdateProfileDto) {
  await this.userRepository.update(userId, {
    username: dto.email,       // ← email → username
    name: dto.name,
    instargram: dto.instargram, // ← instagram → instargram (오타 반영)
    birth: dto.birth,
  });

  const updatedUser = await this.userRepository.findOne({
    where: { userId: userId }, // ← id → userId
  });

  return {
    message: '프로필이 수정되었습니다.',
    profile: {
      email: updatedUser.username,
      name: updatedUser.name,
      instagram: updatedUser.instargram,
      birth: updatedUser.birth,
    },
  };
}

}

