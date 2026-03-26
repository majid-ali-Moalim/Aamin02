import { Injectable } from '@nestjs/common';
import { EmployeeType, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  findAll(employeeType?: EmployeeType) {
    const where: Prisma.EmployeeWhereInput = employeeType
      ? { employeeType }
      : {};

    return this.prisma.employee.findMany({
      where,
      include: {
        user: true,
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
        assignedAmbulance: true,
      },
    });
  }

  async create(data: {
    username: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'EMPLOYEE' | 'PATIENT';
    employeeType: EmployeeType;
    status?: string;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.employee.create({
      data: {
        employeeType: data.employeeType,
        status: data.status ?? 'ACTIVE',
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
