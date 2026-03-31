import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  private async generatePatientCode(): Promise<string> {
    const count = await this.prisma.patient.count();
    const code = `PAT-${String(count + 1).padStart(4, '0')}`;
    return code;
  }

  private includeWithStats = {
    user: {
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    },
    region: true,
    district: true,
    emergencyRequests: {
      orderBy: { createdAt: 'desc' as const },
      take: 1,
      select: {
        createdAt: true,
        ambulance: { select: { ambulanceNumber: true } },
        referrals: {
          take: 1,
          select: { hospitalName: true },
        },
      },
    },
    _count: {
      select: { emergencyRequests: true },
    },
  };

  private toResponseDto(patient: any) {
    const { _count, emergencyRequests, ...rest } = patient;
    const lastRequest = emergencyRequests?.[0];
    return {
      ...rest,
      totalEmergencies: _count?.emergencyRequests ?? 0,
      lastEmergencyDate: lastRequest?.createdAt ?? null,
      lastAmbulanceNumber: lastRequest?.ambulance?.ambulanceNumber ?? null,
      lastHospitalName: lastRequest?.referrals?.[0]?.hospitalName ?? null,
    };
  }

  async create(createPatientDto: any) {
    const { username, email, password, regionId, districtId, ...patientData } = createPatientDto;

    const patientCode = await this.generatePatientCode();

    // Create the linked user account first
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(password || 'patient123', 10);

    const user = await this.prisma.user.create({
      data: {
        username: username || `patient_${Date.now()}`,
        email: email || patientData.email || `patient_${Date.now()}@aamin.so`,
        passwordHash,
        role: 'PATIENT',
      },
    });

    const patient = await this.prisma.patient.create({
      data: {
        ...patientData,
        patientCode,
        userId: user.id,
        region: regionId ? { connect: { id: regionId } } : undefined,
        district: districtId ? { connect: { id: districtId } } : undefined,
      },
      include: this.includeWithStats,
    });

    return this.toResponseDto(patient);
  }

  async findAll() {
    const patients = await this.prisma.patient.findMany({
      include: this.includeWithStats,
      orderBy: { createdAt: 'desc' },
    });
    return patients.map((p) => this.toResponseDto(p));
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: this.includeWithStats,
    });
    if (!patient) throw new NotFoundException(`Patient ${id} not found`);
    return this.toResponseDto(patient);
  }

  async update(id: string, updatePatientDto: any) {
    const { regionId, districtId, ...rest } = updatePatientDto;

    const patient = await this.prisma.patient.update({
      where: { id },
      data: {
        ...rest,
        region: regionId ? { connect: { id: regionId } } : undefined,
        district: districtId ? { connect: { id: districtId } } : undefined,
      },
      include: this.includeWithStats,
    });
    return this.toResponseDto(patient);
  }

  async remove(id: string) {
    return this.prisma.patient.delete({ where: { id } });
  }
}
