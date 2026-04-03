import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { 
    stationId?: string; 
    status?: string; 
    shiftStatus?: string;
    searchTerm?: string;
  }) {
    const where: Prisma.EmployeeWhereInput = {
      employeeRole: {
        name: 'Driver',
      },
    };

    if (filters?.stationId) {
      where.stationId = filters.stationId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.shiftStatus) {
      where.shiftStatus = filters.shiftStatus;
    }

    if (filters?.searchTerm) {
      where.OR = [
        { firstName: { contains: filters.searchTerm, mode: 'insensitive' } },
        { lastName: { contains: filters.searchTerm, mode: 'insensitive' } },
        { employeeCode: { contains: filters.searchTerm, mode: 'insensitive' } },
        { phone: { contains: filters.searchTerm, mode: 'insensitive' } },
      ];
    }

    return this.prisma.employee.findMany({
      where,
      include: {
        user: true,
        employeeRole: true,
        department: true,
        station: true,
        assignedAmbulance: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
        employeeRole: true,
        department: true,
        station: true,
        assignedAmbulance: true,
        drivenRequests: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            patient: true,
            ambulance: true,
          }
        },
        shiftRecords: {
          take: 10,
          orderBy: { startTime: 'desc' },
        },
        attendanceRecords: {
          take: 10,
          orderBy: { date: 'desc' },
        }
      },
    });
  }

  async getStats() {
    const drivers = await this.prisma.employee.findMany({
      where: {
        employeeRole: { name: 'Driver' },
      },
    });

    const total = drivers.length;
    const available = drivers.filter(d => d.shiftStatus === 'AVAILABLE').length;
    const onDuty = drivers.filter(d => d.shiftStatus === 'ON_DUTY').length;
    const onBreak = drivers.filter(d => d.shiftStatus === 'ON_BREAK').length;
    const unavailable = drivers.filter(d => d.shiftStatus === 'UNAVAILABLE').length;
    
    // License expiring within 30 days
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    const expiringLicenses = drivers.filter(d => 
      d.licenseExpiryDate && d.licenseExpiryDate <= nextMonth && d.licenseExpiryDate >= new Date()
    ).length;

    return {
      total,
      available,
      onDuty,
      onBreak,
      unavailable,
      expiringLicenses,
    };
  }

  async updateShiftStatus(id: string, status: string, notes?: string) {
    // End current active shift if any
    if (status !== 'OFF_DUTY') {
      await this.prisma.shiftRecord.updateMany({
        where: {
          employeeId: id,
          endTime: null,
        },
        data: {
          endTime: new Date(),
        },
      });

      // Start new shift record
      await this.prisma.shiftRecord.create({
        data: {
          employeeId: id,
          status,
          notes,
        },
      });
    } else {
        // Just end the active shift
        await this.prisma.shiftRecord.updateMany({
            where: {
                employeeId: id,
                endTime: null,
            },
            data: {
                endTime: new Date(),
            },
        });
    }

    return this.prisma.employee.update({
      where: { id },
      data: { shiftStatus: status },
    });
  }

  async assignAmbulance(id: string, ambulanceId: string | null) {
    return this.prisma.employee.update({
      where: { id },
      data: {
        assignedAmbulanceId: ambulanceId,
      },
    });
  }

  async getAttendance(filters?: { startDate?: string; endDate?: string }) {
    return this.prisma.attendanceRecord.findMany({
      where: {
        date: {
          gte: filters?.startDate ? new Date(filters.startDate) : undefined,
          lte: filters?.endDate ? new Date(filters.endDate) : undefined,
        },
      },
      include: {
        employee: {
          include: {
            station: true,
            assignedAmbulance: true,
          }
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async checkIn(id: string, notes?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new Error('Employee not found');

    // Check if already checked in today
    const existing = await this.prisma.attendanceRecord.findFirst({
      where: {
        employeeId: id,
        date: today,
      },
    });

    if (existing) {
      throw new Error('Already checked in today');
    }

    const checkInTime = new Date();
    let status = 'ON_TIME';
    
    // Logic: if after typicalStartTime, it's LATE
    if (employee.typicalStartTime) {
      const [hours, minutes] = employee.typicalStartTime.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours || 9, minutes || 0, 0, 0);
      
      // Add 15 min buffer
      scheduledTime.setMinutes(scheduledTime.getMinutes() + 15);

      if (checkInTime > scheduledTime) {
        status = 'LATE';
      }
    } else {
      const nineAM = new Date();
      nineAM.setHours(9, 15, 0, 0);
      if (checkInTime > nineAM) {
        status = 'LATE';
      }
    }

    return this.prisma.attendanceRecord.create({
      data: {
        employeeId: id,
        date: today,
        checkIn: checkInTime,
        status,
        notes,
      },
    });
  }

  async checkOut(id: string, notes?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await this.prisma.attendanceRecord.findFirst({
      where: {
        employeeId: id,
        date: today,
      },
    });

    if (!record) {
      throw new Error('No check-in record found for today');
    }

    return this.prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOut: new Date(),
        notes: notes ? `${record.notes || ''}\n${notes}` : record.notes,
      },
    });
  }

  async getPerformance() {
    const drivers = await this.prisma.employee.findMany({
      where: { employeeRole: { name: 'Driver' } },
      include: {
        drivenRequests: {
          where: { 
            status: 'COMPLETED',
            responseMinutes: { not: null }
          },
        },
      },
    });

    return drivers.map(d => {
      const completedMissions = d.drivenRequests.length;
      const totalResponseTime = d.drivenRequests.reduce((acc, req) => acc + (req.responseMinutes || 0), 0);
      const avgResponseTime = completedMissions > 0 ? Math.round(totalResponseTime / completedMissions) : 0;

      return {
        id: d.id,
        name: `${d.firstName} ${d.lastName}`,
        totalMissions: completedMissions,
        avgResponseTime,
      };
    });
  }
}
