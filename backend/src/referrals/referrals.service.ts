import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReferralStatus } from '@prisma/client';

@Injectable()
export class ReferralsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService
  ) {}
  async create(data: any) {
    const result = await this.prisma.referral.create({
      data: {
        emergencyRequest: { connect: { id: data.emergencyRequestId } },
        hospitalName: data.hospitalName,
        status: data.status || 'PENDING',
        notes: data.notes,
      },
      include: {
        emergencyRequest: true,
      },
    });

    await this.notifications.create({
      title: 'New Hospital Referral',
      message: `New referral created for ${result.hospitalName} (Request ${result.emergencyRequest.trackingCode})`,
      type: 'REFERRAL',
      priority: 'MEDIUM',
      relatedModule: 'Referral',
      relatedId: result.id,
      actionUrl: `/admin/referrals?id=${result.id}`,
    });

    return result;
  }

  async findAll() {
    return this.prisma.referral.findMany({
      include: {
        emergencyRequest: {
          include: {
            patient: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const result = await this.prisma.referral.findUnique({
      where: { id },
      include: {
        emergencyRequest: {
          include: {
            patient: true,
          },
        },
      },
    });
    if (!result) throw new NotFoundException(`Referral ${id} not found`);
    return result;
  }

  async update(id: string, data: any) {
    const existing = await this.prisma.referral.findUnique({
      where: { id },
      include: { emergencyRequest: true },
    });
    if (!existing) throw new NotFoundException(`Referral ${id} not found`);

    const result = await this.prisma.referral.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
      },
      include: {
        emergencyRequest: true,
      },
    });

    if (data.status && data.status !== existing.status) {
      await this.notifications.create({
        title: 'Referral Status Update',
        message: `Referral to ${result.hospitalName} status changed to ${result.status}`,
        type: 'REFERRAL',
        priority: result.status === 'REJECTED' ? 'HIGH' : 'MEDIUM',
        relatedModule: 'Referral',
        relatedId: result.id,
        actionUrl: `/admin/referrals?id=${result.id}`,
      });
    }

    return result;
  }

  async remove(id: string) {
    return this.prisma.referral.delete({
      where: { id },
    });
  }
}
