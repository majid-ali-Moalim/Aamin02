import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  create(createNotificationDto: any) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: string) {
    return `This action returns a #${id} notification`;
  }

  update(id: string, updateNotificationDto: any) {
    return `This action updates a #${id} notification`;
  }

  remove(id: string) {
    return `This action removes a #${id} notification`;
  }
}
