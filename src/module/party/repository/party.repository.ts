// ** Typeorm Imports
import { Repository } from 'typeorm';

// ** Custom Module Imports
import { CustomRepository } from '../../../global/repository/typeorm-ex.decorator';
import Party from '../domain/party.entity';

@CustomRepository(Party)
export default class PartyRepository extends Repository<Party> {}
