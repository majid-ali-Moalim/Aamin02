import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debug() {
  console.log('--- Starting Debug Dispatch ---');
  try {
    const data = {
      priority: 'HIGH',
      incidentCategoryId: '',
      requestSource: 'PHONE_CALL',
      regionId: '',
      districtId: '',
      pickupLocation: 'Test Location',
      newPatient: {
        fullName: 'Debug Patient',
        phone: '123456',
        age: '25',
        gender: '',
        bloodType: ''
      }
    };

    // Simulate backend sanitization
    Object.keys(data).forEach(key => {
      if (key.endsWith('Id') && (data as any)[key] === '') {
        (data as any)[key] = null;
      }
    });

    console.log('Sanitized Data:', JSON.stringify(data, null, 2));

    // Handle patient creation logic from service
    const count = await prisma.patient.count();
    const patientCode = `PAT-DEBUG-${count + 1}`;
    
    // Check if user exists
    const uniqueSuffix = Date.now().toString();
    const emailOrUniq = `debug-${uniqueSuffix}@aamin.so`;

    const newUser = await prisma.user.create({
       data: {
          username: `debug-${uniqueSuffix}`,
          email: emailOrUniq,
          passwordHash: 'dummy',
          role: 'PATIENT'
       }
    });

    const newPatRow = await prisma.patient.create({
       data: {
          userId: newUser.id,
          patientCode,
          fullName: data.newPatient.fullName,
          age: data.newPatient.age ? parseInt(data.newPatient.age, 10) : null,
          gender: (data.newPatient.gender as any) || null,
          bloodType: (data.newPatient.bloodType as any) || null,
          phone: data.newPatient.phone || "000000",
          address: "Unknown",
       }
    });

    console.log('Patient Created:', newPatRow.id);

    // Create Request
    const { newPatient, ...restData } = data;
    (restData as any).patientId = newPatRow.id;
    
    // Remove specific relationship keys to prevent conflict
    delete (restData as any).incidentCategoryId;
    delete (restData as any).regionId;
    delete (restData as any).districtId;

    const request = await prisma.emergencyRequest.create({
      data: {
        ...restData as any,
        trackingCode: `DEBUG-${Date.now()}`,
        incidentCategory: data.incidentCategoryId ? { connect: { id: data.incidentCategoryId } } : undefined,
        region: data.regionId ? { connect: { id: data.regionId } } : undefined,
        district: data.districtId ? { connect: { id: data.districtId } } : undefined,
        statusLogs: {
          create: [{
            toStatus: (restData as any).status || 'PENDING',
            notes: 'Emergency Request Created (Debug)',
          }]
        }
      }
    });

    console.log('SUCCESS: Request Created!', request.id);

  } catch (error: any) {
    console.error('ERROR during dispatch:', error);
    if (error.code) console.error('Prisma Code:', error.code);
    if (error.meta) console.error('Prisma Meta:', error.meta);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
