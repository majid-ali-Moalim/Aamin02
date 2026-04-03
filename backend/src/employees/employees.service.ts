import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EmployeesService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService
  ) {}

  findAll(employeeRoleId?: string, departmentId?: string) {
    const where: Prisma.EmployeeWhereInput = {};
    if (employeeRoleId) where.employeeRoleId = employeeRoleId;
    if (departmentId) where.departmentId = departmentId;

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

  findOne(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
        employeeRole: true,
        department: true,
        station: true,
        assignedAmbulance: true,
      },
    });
  }

  private parseDate(dateStr?: string): Date | undefined {
    if (!dateStr || dateStr.trim() === '') return undefined;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? undefined : date;
  }

  async create(data: {
    username: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'EMPLOYEE' | 'PATIENT';
    employeeRoleId?: string;
    departmentId?: string;
    stationId?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    status?: string;
    employeeCode?: string;
    gender?: string;
    dateOfBirth?: string;
    nationalId?: string;
    profilePhoto?: string;
    emergencyContactName?: string;
    emergencyPhone?: string;
    relationship?: string;
    address?: string;
    licenseNumber?: string;
    licenseType?: string;
    licenseClass?: string;
    licenseIssueDate?: string;
    licenseExpiryDate?: string;
    medicalFitness?: string;
    medicalCertificate?: string;
    medicalExpiry?: string;
    employmentDate?: string;
    typicalStartTime?: string;
    typicalEndTime?: string;
    defaultShift?: string;
    assignedAmbulanceId?: string;
    shiftStatus?: string;
    
    // Nurse fields
    alternatePhone?: string;
    qualification?: string;
    specialization?: string;
    yearsOfExperience?: number;
    certificationUpload?: string;
    bloodGroup?: string;
    medicalClearanceStatus?: string;
    workDays?: string;
    backupShift?: string;
  }) {
    console.log('--- EMPLOYEE CREATION ATTEMPT ---');
    console.log('Payload:', JSON.stringify(data, null, 2));

    try {
      const passwordHash = await bcrypt.hash(data.password, 10);

      const result = await this.prisma.employee.create({
        data: {
          employeeRole: data.employeeRoleId?.trim() ? { connect: { id: data.employeeRoleId } } : undefined,
          department: data.departmentId?.trim() ? { connect: { id: data.departmentId } } : undefined,
          station: data.stationId?.trim() ? { connect: { id: data.stationId } } : undefined,
          status: data.status || 'ACTIVE',
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          employeeCode: data.employeeCode,
          gender: data.gender as any,
          dateOfBirth: this.parseDate(data.dateOfBirth),
          nationalId: data.nationalId,
          profilePhoto: data.profilePhoto,
          emergencyContactName: data.emergencyContactName,
          emergencyPhone: data.emergencyPhone,
          relationship: data.relationship,
          address: data.address,
          licenseNumber: data.licenseNumber,
          licenseType: data.licenseType,
          licenseClass: data.licenseClass,
          licenseIssueDate: this.parseDate(data.licenseIssueDate),
          licenseExpiryDate: this.parseDate(data.licenseExpiryDate),
          medicalFitness: data.medicalFitness,
          medicalCertificate: data.medicalCertificate,
          medicalExpiry: this.parseDate(data.medicalExpiry),
          employmentDate: this.parseDate(data.employmentDate),
          typicalStartTime: data.typicalStartTime,
          typicalEndTime: data.typicalEndTime,
          defaultShift: data.defaultShift,
          assignedAmbulance: data.assignedAmbulanceId?.trim() ? { connect: { id: data.assignedAmbulanceId } } : undefined,
          shiftStatus: data.shiftStatus || 'AVAILABLE',

          // Nurse & Professional Med
          alternatePhone: data.alternatePhone,
          qualification: data.qualification,
          specialization: data.specialization,
          yearsOfExperience: data.yearsOfExperience ? Number(data.yearsOfExperience) : undefined,
          certificationUpload: data.certificationUpload,
          bloodGroup: data.bloodGroup,
          medicalClearanceStatus: data.medicalClearanceStatus || 'PENDING',
          workDays: data.workDays,
          backupShift: data.backupShift,
          user: {
            create: {
              username: data.username,
              email: data.email,
              passwordHash,
              role: data.role || 'EMPLOYEE',
            },
          },
        },
        include: {
          user: true,
          employeeRole: true,
          department: true,
          station: true,
          assignedAmbulance: true,
        },
      });

      console.log('SUCCESS: Employee created with ID:', result.id);

      await this.notifications.create({
        title: 'New Staff Registered',
        message: `${result.firstName} ${result.lastName} joined as ${result.employeeRole?.name || 'Staff'}`,
        type: 'STAFF',
        priority: 'MEDIUM',
        relatedModule: 'Employee',
        relatedId: result.id,
      });

      return result;
    } catch (error: any) {
      console.error('FAILURE: Employee creation failed');
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      
      if (error.code === 'P2002') {
        const target = error.meta?.target?.[0] || 'field';
        const friendlyName = target.replace(/([A-Z])/g, ' $1').toLowerCase();
        const message = `An employee with this ${friendlyName} already exists.`;
        console.warn('Handling P2002:', message);
        throw new ConflictException(message);
      }

      throw error;
    }
  }

  async update(id: string, data: Prisma.EmployeeUpdateInput) {
    const result = await this.prisma.employee.update({
      where: { id },
      data,
      include: {
        user: true,
        employeeRole: true,
        department: true,
        station: true,
        assignedAmbulance: true,
      },
    });

    if (data.status || data.shiftStatus) {
      await this.notifications.create({
        title: 'Staff Status Update',
        message: `${result.firstName} ${result.lastName} is now ${data.status || result.status} (${data.shiftStatus || result.shiftStatus})`,
        type: 'STAFF',
        priority: 'LOW',
        relatedModule: 'Employee',
        relatedId: result.id,
        actionUrl: `/admin/employees?id=${result.id}`,
      });
    }

    return result;
  }

  delete(id: string) {
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
