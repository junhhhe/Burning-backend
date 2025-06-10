// ** Typeorm Imports
import { Repository } from 'typeorm';

// ** Custom Module Imports
import { CustomRepository } from '../../../global/repository/typeorm-ex.decorator';
import Message from '../domain/message.entity';

@CustomRepository(Message)
export default class MessageRepository extends Repository<Message> {}
