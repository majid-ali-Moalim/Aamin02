import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import {
  EmergencyRequestStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmergencyRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      // Robust Recursion: Sanitize only non-null objects
      const sanitize = (obj: any) => {
        if (obj && typeof obj === 'object') {
          Object.keys(obj).forEach(key => {
            if (obj[key] === '') {
              obj[key] = null;
            } else if (obj[key] !== null && typeof obj[key] === 'object') {
              sanitize(obj[key]);
            }
          });
        }
      };
      sanitize(data);

      let patientId = data.patientId;

      // Handle Inline Patient Creation (nested)
      if (data.newPatient) {
        // Check existing by phone
        const existingPatient = await this.prisma.patient.findFirst({
          where: { phone: String(data.newPatient.phone) }
        });

        if (existingPatient) {
          patientId = existingPatient.id;
        } else {
          // Create new user & patient
          const count = await this.prisma.patient.count();
          const patientCode = `PAT-${String(count + 1).padStart(4, '0')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
          
          const bcrypt = require('bcrypt');
          const uniqueSuffix = Date.now().toString().slice(-6);
          const emailOrUniq = `pat-${uniqueSuffix}-${Math.floor(Math.random() * 1000)}@aamin.so`; 
          const username = data.newPatient.phone ? String(data.newPatient.phone) : emailOrUniq;
          
          const existingUser = await this.prisma.user.findFirst({
            where: { OR: [{ username }, { email: emailOrUniq }] }
          });

          let userId;
          if (existingUser) {
            userId = existingUser.id;
          } else {
            const passwordHash = await bcrypt.hash('patient123', 10);
            const newUser = await this.prisma.user.create({
              data: { username, email: emailOrUniq, passwordHash, role: 'PATIENT' }
            });
            userId = newUser.id;
          }

          // Whitelist Patient Fields
          const newPatRow = await this.prisma.patient.create({
            data: {
              userId,
              patientCode,
              fullName: String(data.newPatient.fullName),
              age: data.newPatient.age ? parseInt(String(data.newPatient.age), 10) : null,
              gender: data.newPatient.gender || null,
              bloodType: data.newPatient.bloodType || null,
              phone: String(data.newPatient.phone),
              alternatePhone: data.newPatient.alternatePhone || null,
              address: "Self-Registered Dispatch",
            }
          });
          patientId = newPatRow.id;
        }
      }

      if (!patientId) {
        throw new BadRequestException('A valid Patient ID or New Patient data is required for dispatch.');
      }

      // STRICT WHITELIST for EmergencyRequest
      // This prevents Prisma 'Invalid invocation' errors from unknown frontend fields
      // ISOLATION TEST: Bare minimum fields to find the bug
      const finalPayload: any = {
        trackingCode: data.trackingCode || this.generateTrackingCode(),
        priority: data.priority || 'MEDIUM',
        requestSource: data.requestSource || 'PHONE_CALL',
        pickupLocation: String(data.pickupLocation),
        // Relations
        patient: { connect: { id: patientId } },
      };
      
      // Optional fields added one by one with safe checks
      if (data.incidentCategoryId) finalPayload.incidentCategory = { connect: { id: data.incidentCategoryId } };
      if (data.regionId) finalPayload.region = { connect: { id: data.regionId } };
      if (data.districtId) finalPayload.district = { connect: { id: data.districtId } };
      
      // Add optional string fields
      const optionalStrings = [
        'destination', 'callerName', 'callerPhone', 'symptoms', 
        'pickupLandmark', 'destinationLandmark', 'patientCondition', 
        'notes', 'manualDispatchNotes'
      ];
      optionalStrings.forEach(field => {
        if (data[field]) finalPayload[field] = String(data[field]);
      });

      console.log('DIAGNOSTIC - Sending to Prisma:', JSON.stringify(finalPayload, null, 2));

      return await this.prisma.emergencyRequest.create({
        data: finalPayload
      });
    } catch (error: any) {
      console.error('STRICT DISPATCH ERROR:', error);
      let detail = error.message;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        detail = `Prisma Error ${error.code}: ${error.message} - Target: ${JSON.stringify(error.meta)}`;
      }
      throw new BadRequestException(detail || 'Severe error during emergency dispatch.');
    }
  }

  findAll() {
    return this.prisma.emergencyRequest.findMany({
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        dispatcher: {
          include: {
            user: true,
          },
        },
        driver: {
          include: {
            user: true,
          },
        },
        ambulance: true,
        referrals: true,
        statusLogs: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.emergencyRequest.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        dispatcher: {
          include: {
            user: true,
          },
        },
        driver: {
          include: {
            user: true,
          },
        },
        ambulance: true,
        referrals: true,
        statusLogs: {
          orderBy: { createdAt: 'desc' }
        }
      },
    });
  }

  async findByTrackingCode(trackingCode: string) {
    const emergencyRequest = await this.prisma.emergencyRequest.findUnique({
      where: { trackingCode },
      include: {
        patient: true,
        dispatcher: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        driver: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        ambulance: true,
        referrals: true,
      },
    });

    if (!emergencyRequest) {
      throw new NotFoundException('Emergency request not found');
    }

    return emergencyRequest;
  }

  async assign(
    id: string,
    data: {
      dispatcherId?: string;
      driverId?: string;
      ambulanceId?: string;
      status?: EmergencyRequestStatus;
    },
  ) {
    const existing = await this.prisma.emergencyRequest.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Emergency request not found');

    const updateData: any = { ...data, assignedAt: new Date() };

    return this.prisma.emergencyRequest.update({
      where: { id },
      data: {
        ...updateData,
        statusLogs: data.status ? {
          create: {
            fromStatus: existing.status,
            toStatus: data.status,
            notes: `Team assigned`,
          }
        } : undefined
      },
      include: {
        patient: true,
        dispatcher: true,
        driver: true,
        ambulance: true,
        statusLogs: true
      },
    });
  }

  async updateStatus(id: string, status: EmergencyRequestStatus, employeeId?: string) {
    const existing = await this.prisma.emergencyRequest.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Emergency request not found');

    const updateData: any = { status };
    if (status === 'DISPATCHED') updateData.dispatchedAt = new Date();
    else if (status === 'ON_SCENE') updateData.arrivedAtSceneAt = new Date();
    else if (status === 'TRANSPORTING') updateData.departedSceneAt = new Date();
    else if (status === 'ARRIVED_HOSPITAL') updateData.arrivedDestinationAt = new Date();
    else if (status === 'COMPLETED') updateData.completedAt = new Date();
    else if (status === 'CANCELLED') updateData.cancelledAt = new Date();

    return this.prisma.emergencyRequest.update({
      where: { id },
      data: {
        ...updateData,
        statusLogs: {
          create: {
            fromStatus: existing.status,
            toStatus: status,
            changedByEmployeeId: employeeId,
            notes: `Status changed to ${status}`,
          }
        }
      },
      include: {
        statusLogs: true
      }
    });
  }

  update(id: string, data: Prisma.EmergencyRequestUpdateInput) {
    return this.prisma.emergencyRequest.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.emergencyRequest.delete({
      where: { id },
    });
  }

  private generateTrackingCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `AAM-${timestamp}-${random}`.toUpperCase();
  }

  async getAvailableAmbulances() {
    return this.prisma.ambulance.findMany({
      where: {
        status: 'AVAILABLE',
      },
    });
  }

  async getAvailableDrivers() {
    const driverRole = await this.prisma.employeeRole.findFirst({
      where: { name: { contains: 'Driver', mode: 'insensitive' } }
    });
    
    if (!driverRole) return [];

    return this.prisma.employee.findMany({
      where: {
        employeeRoleId: driverRole.id,
        status: 'ACTIVE',
        // Removed assignedAmbulanceId: null to allow assigning drivers with vehicles
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        employeeRole: true,
        assignedAmbulance: true,
      },
    });
  }

  async getDashboardStats() {
    const total = await this.prisma.emergencyRequest.count();
    const pending = await this.prisma.emergencyRequest.count({
      where: { status: 'PENDING' },
    });
    const assigned = await this.prisma.emergencyRequest.count({
      where: { status: 'ASSIGNED' },
    });
    const completed = await this.prisma.emergencyRequest.count({
      where: { status: 'COMPLETED' },
    });

    return {
      total,
      pending,
      assigned,
      completed,
    };
  }
}
