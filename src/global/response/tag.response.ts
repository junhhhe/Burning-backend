import {
  createResponse,
  createErrorResponse,
} from '../../global/response/common';

export const TagResponse = {
  save: {
    201: createResponse({
      data: { tagId: 1 },
      statusCode: 201,
      message: '태그가 성공적으로 생성되었습니다.',
    }),
    409: createErrorResponse({
      statusCode: 409,
      message: '이미 존재하는 태그입니다.',
      error: 'BAD REQUEST',
    }),
  },
};
