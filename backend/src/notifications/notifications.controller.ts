import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationType, NotificationPriority, NotificationStatus } from '@prisma/client';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('type') type?: NotificationType,
    @Query('status') status?: NotificationStatus,
    @Query('priority') priority?: NotificationPriority,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.notificationsService.findAll({
      userId,
      type,
      status,
      priority,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
    });
  }

  @Get('stats')
  async getStats() {
    return this.notificationsService.getStats();
  }

  @Get('recent')
  async getRecent(@Query('userId') userId?: string) {
    return this.notificationsService.findAll({
      userId,
      limit: 10,
    });
  }

  @Post('mark-all-read')
  async markAllRead(@Body('userId') userId?: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch(':id/resolve')
  async resolve(@Param('id') id: string) {
    return this.notificationsService.resolve(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }

  @Post('check-maintenance')
  async checkMaintenance() {
    await this.notificationsService.checkMaintenanceAlerts();
    return { success: true };
  }
}
