// ** Typeorm Imports
import { Repository } from 'typeorm';

// ** Custom Module Imports
import { CustomRepository } from '../../../global/repository/typeorm-ex.decorator';
import PartyMember from '../domain/party.member.entity';

@CustomRepository(PartyMember)
export default class PartyMemberRepository extends Repository<PartyMember> {}
