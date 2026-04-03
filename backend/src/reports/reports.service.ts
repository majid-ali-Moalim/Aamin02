import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      activeEmergencies,
      availableAmbulances,
      totalUsersCount,
      totalDrivers,
      totalPatients,
      completedCases,
      pendingRequests,
      referralCount,
      recentEmergencies,
      recentReferrals,
      recentEmployees
    ] = await Promise.all([
      this.prisma.emergencyRequest.count({
        where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } }
      }),
      this.prisma.ambulance.count({
        where: { status: 'AVAILABLE' }
      }),
      this.prisma.user.count(),
      this.prisma.employee.count({
        where: { employeeRole: { name: { contains: 'Driver', mode: 'insensitive' } } }
      }),
      this.prisma.patient.count(),
      this.prisma.emergencyRequest.count({
        where: { status: 'COMPLETED' }
      }),
      this.prisma.emergencyRequest.count({
        where: { status: 'PENDING' }
      }),
      this.prisma.referral.count(),
      // Recent Activity
      this.prisma.emergencyRequest.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { patient: true }
      }),
      this.prisma.referral.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        include: { emergencyRequest: { include: { patient: true } } }
      }),
      this.prisma.employee.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        include: { user: true, employeeRole: true }
      })
    ]);

    // Format recent activity
    const activity: any[] = [];

    recentEmergencies.forEach(e => {
      activity.push({
        id: `e-${e.id}`,
        type: 'emergency',
        description: `New emergency request for ${e.patient.fullName}`,
        time: this.formatTimeAgo(e.createdAt),
        rawDate: e.createdAt,
        status: e.status === 'PENDING' ? 'warning' : 'success'
      });
    });

    recentReferrals.forEach(r => {
      activity.push({
        id: `r-${r.id}`,
        type: 'referral',
        description: `Referral to ${r.hospitalName} for ${r.emergencyRequest.patient.fullName}`,
        time: this.formatTimeAgo(r.createdAt),
        rawDate: r.createdAt,
        status: 'success'
      });
    });

    recentEmployees.forEach(emp => {
      activity.push({
        id: `emp-${emp.id}`,
        type: 'user',
        description: `New ${emp.employeeRole?.name || 'employee'} registered: ${emp.firstName || emp.user.username}`,
        time: this.formatTimeAgo(emp.createdAt),
        rawDate: emp.createdAt,
        status: 'success'
      });
    });

    // Sort activity by creation time
    activity.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

    return {
      stats: {
        activeEmergencies,
        availableAmbulances,
        totalUsers: totalUsersCount,
        totalDrivers,
        totalPatients,
        completedCases,
        pendingRequests,
        referralCount
      },
      recentActivity: activity.slice(0, 5)
    };
  }

  private formatTimeAgo(date: Date) {
    const diff = new Date().getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  create(createReportDto: any) {
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: string) {
    return `This action returns a #${id} report`;
  }

  update(id: string, updateReportDto: any) {
    return `This action updates a #${id} report`;
  }

  remove(id: string) {
    return `This action removes a #${id} report`;
  }
}
