import {
  createResponse,
  createErrorResponse,
  createMessageResponse,
} from '../../global/response/common';

export const PartyResponse = {
  find: {
    200: createResponse({
      data: {
        partyId: 3,
        title: '파티 상세 예시',
        content:
          '이것은 파티 상세 페이지의 임시 데이터입니다. API 연동 시 실제 데이터로 대체됩니다.',
        partyImage: 'https://example.com/image.jpg',
        partyDate: '2024-07-16',
        startDate: '2024-07-16',
        endDate: '2024-07-16',
        location: '강남구 신사동',
        personnel: 100,
        currentPersonnel: 50,
        partyState: 'OPEN',
        tags: ['홈파티', '파티', '만남'],
        host: '주최자',
        averageRating: 4.5,
        reviewCount: 2,
      },
      statusCode: 200,
      message: '파티 단일 조회에 성공했습니다.',
    }),
    404: createErrorResponse({
      statusCode: 404,
      message: '해당 파티를 찾을 수 없습니다.',
      error: 'NOT FOUND',
    }),
  },

  findAll: {
    200: createResponse({
      data: [
        {
          partyId: 1,
          title: '파티 A',
          content: '설명 A',
          partyImage: 'https://example.com/image1.jpg',
          location: '서울특별시',
          partyDate: '2024-07-10',
          personnel: 80,
          currentPersonnel: 30,
          tags: ['파티'],
          partyState: 'OPEN',
        },
        {
          partyId: 2,
          title: '파티 B',
          content: '설명 B',
          partyImage: 'https://example.com/image2.jpg',
          location: '부산 해운대',
          partyDate: '2024-07-12',
          personnel: 5,
          currentPersonnel: 2,
          tags: ['만남'],
          partyState: 'OPEN',
        },
      ],
      statusCode: 200,
      message: '파티 전체 조회에 성공했습니다.',
    }),
    404: createErrorResponse({
      statusCode: 404,
      message: '파티를 찾을 수 없습니다.',
      error: 'NOT FOUND',
    }),
  },

  save: {
    201: createResponse({
      data: { partyId: 10 },
      statusCode: 201,
      message: '파티가 성공적으로 생성되었습니다.',
    }),
    400: createErrorResponse({
      statusCode: 400,
      message: '잘못된 요청입니다.',
      error: 'BAD REQUEST',
    }),
  },

  update: {
    200: createMessageResponse({
      statusCode: 200,
      message: '파티가 성공적으로 수정되었습니다.',
    }),
    404: createErrorResponse({
      statusCode: 404,
      message: '파티를 찾을 수 없거나 권한이 없습니다.',
      error: 'NOT FOUND',
    }),
  },

  delete: {
    200: createMessageResponse({
      statusCode: 200,
      message: '파티가 성공적으로 삭제되었습니다.',
    }),
    404: createErrorResponse({
      statusCode: 404,
      message: '파티를 찾을 수 없거나 권한이 없습니다.',
      error: 'NOT FOUND',
    }),
  },
};
