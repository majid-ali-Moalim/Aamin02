import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EmergencyRequestStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmergencyRequestsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.EmergencyRequestCreateInput) {
    return this.prisma.emergencyRequest.create({
      data,
    });
  }

  findAll() {
    return this.prisma.emergencyRequest.findMany({
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        dispatcher: {
          include: {
            user: true,
          },
        },
        driver: {
          include: {
            user: true,
          },
        },
        ambulance: true,
        referrals: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.emergencyRequest.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        dispatcher: {
          include: {
            user: true,
          },
        },
        driver: {
          include: {
            user: true,
          },
        },
        ambulance: true,
        referrals: true,
      },
    });
  }

  async findByTrackingCode(trackingCode: string) {
    const emergencyRequest = await this.prisma.emergencyRequest.findUnique({
      where: { trackingCode },
      include: {
        patient: true,
        dispatcher: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        driver: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        ambulance: true,
        referrals: true,
      },
    });

    if (!emergencyRequest) {
      throw new NotFoundException('Emergency request not found');
    }

    return emergencyRequest;
  }

  assign(
    id: string,
    data: {
      dispatcherId?: string;
      driverId?: string;
      ambulanceId?: string;
      status?: EmergencyRequestStatus;
    },
  ) {
    return this.prisma.emergencyRequest.update({
      where: { id },
      data,
      include: {
        patient: true,
        dispatcher: true,
        driver: true,
        ambulance: true,
      },
    });
  }

  updateStatus(id: string, status: EmergencyRequestStatus) {
    return this.prisma.emergencyRequest.update({
      where: { id },
      data: { status },
    });
  }

  update(id: string, data: Prisma.EmergencyRequestUpdateInput) {
    return this.prisma.emergencyRequest.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.emergencyRequest.delete({
      where: { id },
    });
  }

  private generateTrackingCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `AAM-${timestamp}-${random}`.toUpperCase();
  }

  async getAvailableAmbulances() {
    return this.prisma.ambulance.findMany({
      where: {
        status: 'AVAILABLE',
      },
    });
  }

  async getAvailableDrivers() {
    return this.prisma.employee.findMany({
      where: {
        employeeType: 'DRIVER',
        status: 'ACTIVE',
        assignedAmbulanceId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async getDashboardStats() {
    const total = await this.prisma.emergencyRequest.count();
    const pending = await this.prisma.emergencyRequest.count({
      where: { status: 'PENDING' },
    });
    const assigned = await this.prisma.emergencyRequest.count({
      where: { status: 'ASSIGNED' },
    });
    const completed = await this.prisma.emergencyRequest.count({
      where: { status: 'COMPLETED' },
    });

    return {
      total,
      pending,
      assigned,
      completed,
    };
  }
}
