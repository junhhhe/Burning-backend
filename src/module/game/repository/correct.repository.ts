// ** Typeorm Imports
import { Repository } from 'typeorm';

// ** Custom Module Imports
import { CustomRepository } from '../../../global/repository/typeorm-ex.decorator';
import Correct from '../domain/correct.entity';

@CustomRepository(Correct)
export default class CorrectRepository extends Repository<Correct> {}
