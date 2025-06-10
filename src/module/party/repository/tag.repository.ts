// ** Typeorm Imports
import { Repository } from 'typeorm';

// ** Custom Module Imports
import { CustomRepository } from '../../../global/repository/typeorm-ex.decorator';
import Tag from '../domain/tag.entity';

@CustomRepository(Tag)
export default class TagRepository extends Repository<Tag> {}
