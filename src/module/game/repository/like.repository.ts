// ** Typeorm Imports
import { Repository } from 'typeorm';

// ** Custom Module Imports
import { CustomRepository } from '../../../global/repository/typeorm-ex.decorator';
import Like from '../domain/like.entity';

@CustomRepository(Like)
export default class LikeRepository extends Repository<Like> {}
