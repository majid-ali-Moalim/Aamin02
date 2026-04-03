import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationPriority, NotificationStatus } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    userId?: string;
    targetRole?: any; // To avoid type issues before Prisma client regen completion
    actionUrl?: string;
    relatedModule?: string;
    relatedId?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        ...data,
        status: 'UNREAD',
      },
    });
  }

  async broadcast(data: {
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    targetRole: any;
    actionUrl?: string;
    relatedModule?: string;
    relatedId?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        ...data,
        status: 'UNREAD',
      },
    });
  }

  async findAll(filters: {
    userId?: string;
    type?: NotificationType;
    status?: NotificationStatus;
    priority?: NotificationPriority;
    limit?: number;
    offset?: number;
  }) {
    const { limit = 20, offset = 0, ...where } = filters;
    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: { user: { select: { username: true, email: true } } },
    });
  }

  async getStats() {
    const [total, unread, critical, resolved] = await Promise.all([
      this.prisma.notification.count(),
      this.prisma.notification.count({ where: { status: 'UNREAD' } }),
      this.prisma.notification.count({ where: { priority: 'CRITICAL' } }),
      this.prisma.notification.count({ where: { status: 'RESOLVED' } }),
    ]);

    const typeCounts = await this.prisma.notification.groupBy({
      by: ['type'],
      _count: true,
    });

    return {
      total,
      unread,
      critical,
      resolved,
      typeCounts: typeCounts.reduce((acc, curr) => {
        acc[curr.type] = curr._count;
        return acc;
      }, {}),
    };
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { status: 'READ' },
    });
  }

  async markAllAsRead(userId?: string) {
    return this.prisma.notification.updateMany({
      where: { userId, status: 'UNREAD' },
      data: { status: 'READ' },
    });
  }

  async resolve(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { status: 'RESOLVED' },
    });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }

  // Helper for maintenance alerts
  async checkMaintenanceAlerts() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    const ambulances = await this.prisma.ambulance.findMany({
      where: {
        OR: [
          { fuelLevel: { lt: 20 } },
          { nextMaintenance: { lte: targetDate } }
        ]
      }
    });

    for (const amb of ambulances) {
      if (amb.fuelLevel < 20) {
        await this.create({
          title: 'Ambulance Fuel Low',
          message: `Ambulance ${amb.ambulanceNumber} fuel level is at ${amb.fuelLevel}%`,
          type: 'MAINTENANCE',
          priority: 'HIGH',
          relatedModule: 'Ambulance',
          relatedId: amb.id,
        });
      }
      if (amb.nextMaintenance && amb.nextMaintenance <= targetDate) {
        await this.create({
          title: 'Maintenance Due Soon',
          message: `Ambulance ${amb.ambulanceNumber} requires maintenance by ${amb.nextMaintenance.toLocaleDateString()}`,
          type: 'MAINTENANCE',
          priority: 'MEDIUM',
          relatedModule: 'Ambulance',
          relatedId: amb.id,
        });
      }
    }
  }
}
