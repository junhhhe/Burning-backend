// ** Typeorm Imports
import { Repository } from 'typeorm';

// ** Custom Module Imports
import { CustomRepository } from '../../../global/repository/typeorm-ex.decorator';
import Notification from '../domain/notification.entity';

@CustomRepository(Notification)
export default class NotificationRepository extends Repository<Notification> {}
