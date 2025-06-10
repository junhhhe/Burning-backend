// ** Typeorm Imports
import { Repository } from 'typeorm';

// ** Custom Module Imports
import { CustomRepository } from '../../../global/repository/typeorm-ex.decorator';
import Review from '../domain/review.entity';

@CustomRepository(Review)
export default class ReviewRepository extends Repository<Review> {}
