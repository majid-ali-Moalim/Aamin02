import { Injectable } from '@nestjs/common';
import { AmbulanceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AmbulancesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.ambulance.findMany({
      include: {
        employees: {
          include: {
            user: true,
          },
        },
        emergencyRequests: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.ambulance.findUnique({
      where: { id },
      include: {
        employees: {
          include: {
            user: true,
          },
        },
        emergencyRequests: true,
      },
    });
  }

  create(data: Prisma.AmbulanceCreateInput) {
    return this.prisma.ambulance.create({
      data,
      include: {
        employees: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  update(id: string, data: Prisma.AmbulanceUpdateInput) {
    return this.prisma.ambulance.update({
      where: { id },
      data,
      include: {
        employees: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  assignDriver(id: string, driverEmployeeId: string) {
    return this.prisma.employee.update({
      where: { id: driverEmployeeId },
      data: {
        assignedAmbulanceId: id,
      },
      include: {
        user: true,
        assignedAmbulance: true,
      },
    });
  }

  findByStatus(status: AmbulanceStatus) {
    return this.prisma.ambulance.findMany({
      where: { status },
      include: {
        employees: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  delete(id: string) {
    return this.prisma.ambulance.delete({
      where: { id },
    });
  }
}
