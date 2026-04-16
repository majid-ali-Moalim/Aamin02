import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HospitalsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { regionId?: string; districtId?: string }) {
    const where: Prisma.HospitalWhereInput = {};
    if (filters?.regionId) where.regionId = filters.regionId;
    if (filters?.districtId) where.districtId = filters.districtId;

    return this.prisma.hospital.findMany({
      where,
      include: {
        region: true,
        district: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id },
      include: {
        region: true,
        district: true,
      },
    });

    if (!hospital) throw new NotFoundException('Hospital not found');
    return hospital;
  }

  async create(data: any) {
    const { regionId, districtId, ...rest } = data;
    return this.prisma.hospital.create({
      data: {
        ...rest,
        region: regionId ? { connect: { id: regionId } } : undefined,
        district: districtId ? { connect: { id: districtId } } : undefined,
      },
    });
  }

  async update(id: string, data: any) {
    const { regionId, districtId, ...rest } = data;
    const updateData: any = { ...rest };
    
    if (regionId !== undefined) {
      updateData.region = regionId ? { connect: { id: regionId } } : { disconnect: true };
    }
    
    if (districtId !== undefined) {
      updateData.district = districtId ? { connect: { id: districtId } } : { disconnect: true };
    }
    
    return this.prisma.hospital.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.hospital.delete({
      where: { id },
    });
  }
}
