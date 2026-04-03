import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemSetupService {
  constructor(private prisma: PrismaService) {}

  // --- Dynamic Model Helpers ---
  private getModel(modelName: string) {
    const model = (this.prisma as any)[modelName];
    if (!model) throw new Error(`Model ${modelName} not found in Prisma`);
    return model;
  }

  // --- Generic CRUD ---
  async findAll(modelName: string, include?: any) {
    return this.getModel(modelName).findMany({
      where: { isActive: true },
      include,
      orderBy: { name: 'asc' },
    });
  }

  async create(modelName: string, data: any) {
    try {
      return await this.getModel(modelName).create({ data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target?.[0] || 'identifier';
        const friendlyName = target.replace(/([A-Z])/g, ' $1').toLowerCase();
        throw new ConflictException(`A record with this ${friendlyName} already exists. Please use a different value.`);
      }
      throw error;
    }
  }

  async update(modelName: string, id: string, data: any) {
    try {
      return await this.getModel(modelName).update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target?.[0] || 'identifier';
        const friendlyName = target.replace(/([A-Z])/g, ' $1').toLowerCase();
        throw new ConflictException(`A record with this ${friendlyName} already exists.`);
      }
      throw error;
    }
  }

  async remove(modelName: string, id: string) {
    return this.getModel(modelName).update({
      where: { id },
      data: { isActive: false },
    });
  }

  // --- Specialized Lookups ---
  async getRegions() {
    return this.prisma.region.findMany({
      where: { isActive: true },
      include: { districts: true },
      orderBy: { name: 'asc' },
    });
  }

  async getDistricts(regionId?: string) {
    return this.prisma.district.findMany({
      where: { 
        isActive: true,
        ...(regionId ? { regionId } : {})
      },
      include: { region: true },
      orderBy: { name: 'asc' },
    });
  }

  async getDepartments() {
    return this.prisma.department.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  }

  async getEmployeeRoles() {
    return this.prisma.employeeRole.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  }

  async getEquipmentLevels() {
    return this.prisma.equipmentLevel.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  }

  async getIncidentCategories() {
    return this.prisma.incidentCategory.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  }

  async getStations(districtId?: string) {
    return this.prisma.station.findMany({
      where: { 
        isActive: true,
        ...(districtId ? { districtId } : {})
      },
      include: { district: true, region: true },
      orderBy: { name: 'asc' },
    });
  }
}
