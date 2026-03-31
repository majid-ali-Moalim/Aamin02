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
            employeeRole: true,
          },
        },
        region: true,
        district: true,
        station: true,
        equipmentLevel: true,
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
            employeeRole: true,
          },
        },
        region: true,
        district: true,
        station: true,
        equipmentLevel: true,
        emergencyRequests: true,
      },
    });
  }

  create(data: any) {
    // We use 'any' to allow incoming IDs for relations before DTOs are fully strictly typed
    const { regionId, districtId, stationId, equipmentLevelId, ...rest } = data;

    return this.prisma.ambulance.create({
      data: {
        ...rest,
        region: regionId ? { connect: { id: regionId } } : undefined,
        district: districtId ? { connect: { id: districtId } } : undefined,
        station: stationId ? { connect: { id: stationId } } : undefined,
        equipmentLevel: equipmentLevelId ? { connect: { id: equipmentLevelId } } : undefined,
      },
      include: {
        employees: {
          include: {
            user: true,
            employeeRole: true,
          },
        },
        region: true,
        district: true,
        station: true,
        equipmentLevel: true,
      },
    });
  }

  update(id: string, data: any) {
    const { regionId, districtId, stationId, equipmentLevelId, ...rest } = data;

    return this.prisma.ambulance.update({
      where: { id },
      data: {
        ...rest,
        region: regionId ? { connect: { id: regionId } } : undefined,
        district: districtId ? { connect: { id: districtId } } : undefined,
        station: stationId ? { connect: { id: stationId } } : undefined,
        equipmentLevel: equipmentLevelId ? { connect: { id: equipmentLevelId } } : undefined,
      },
      include: {
        employees: {
          include: {
            user: true,
            employeeRole: true,
          },
        },
        region: true,
        district: true,
        station: true,
        equipmentLevel: true,
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
            employeeRole: true,
          },
        },
        region: true,
        district: true,
        station: true,
        equipmentLevel: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: string, status: AmbulanceStatus) {
    return this.prisma.ambulance.update({
      where: { id },
      data: { status },
      include: {
        employees: {
          include: {
            user: true,
            employeeRole: true,
          },
        },
        region: true,
        district: true,
        station: true,
        equipmentLevel: true,
      },
    });
  }

  assignDriver(id: string, driverEmployeeId: string) {
    const updateEmployee = this.prisma.employee.update({
      where: { id: driverEmployeeId },
      data: {
        assignedAmbulanceId: id,
      },
      include: {
        user: true,
        assignedAmbulance: true,
      },
    });

    const updateAmbulance = this.prisma.ambulance.update({
      where: { id },
      data: {
        status: AmbulanceStatus.ON_DUTY,
      },
      include: {
        employees: {
          include: {
            user: true,
            employeeRole: true,
          },
        },
      },
    });

    return Promise.all([updateEmployee, updateAmbulance]);
  }

  delete(id: string) {
    return this.prisma.ambulance.delete({
      where: { id },
    });
  }
}
