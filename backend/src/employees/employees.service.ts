import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

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
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.employee.create({
      data: {
        employeeRole: data.employeeRoleId ? { connect: { id: data.employeeRoleId } } : undefined,
        department: data.departmentId ? { connect: { id: data.departmentId } } : undefined,
        station: data.stationId ? { connect: { id: data.stationId } } : undefined,
        status: data.status ?? 'ACTIVE',
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        user: {
          create: {
            username: data.username,
            email: data.email,
            passwordHash,
            role: data.role,
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
  }

  update(id: string, data: Prisma.EmployeeUpdateInput) {
    return this.prisma.employee.update({
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
  }

  delete(id: string) {
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}
