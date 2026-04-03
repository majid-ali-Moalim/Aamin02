import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Driver Master Data ---');

  // 0. Get a valid region and district
  const region = await prisma.region.findFirst();
  const district = await prisma.district.findFirst();

  if (!region || !district) {
    console.warn('⚠ No region or district found. Please seed regions and districts first.');
    return;
  }

  // 1. Create Stations
  const stationData = [
    { name: 'Mogadishu - Main Station', location: 'KM4 Area', code: 'STA-MOG-01' },
    { name: 'Mogadishu - North District', location: 'Kaaraan', code: 'STA-MOG-02' },
    { name: 'Adan Adde Airport Point', location: 'Aerodrome', code: 'STA-AIR-01' },
    { name: 'Hargeisa Base', location: 'Downtown', code: 'STA-HAR-01' }
  ];

  for (const s of stationData) {
    // We use create because we want to ensure they exist. 
    // If they already exist, we ignore error in this simple demo script.
    try {
      await prisma.station.create({
        data: {
          ...s as any,
          region: { connect: { id: region.id } },
          district: { connect: { id: district.id } }
        }
      });
    } catch (e) {
      // already exists
    }
  }
  console.log('✔ Stations seeded or already exist.');

  // 2. Create specialized Ambulances
  const ambulanceData = [
    { ambulanceNumber: 'AMB-701', plateNumber: 'A-2910', status: 'AVAILABLE' as any, vehicleType: 'Advanced Life Support (ALS)' },
    { ambulanceNumber: 'AMB-702', plateNumber: 'A-2911', status: 'AVAILABLE' as any, vehicleType: 'Basic Life Support (BLS)' },
    { ambulanceNumber: 'AMB-703', plateNumber: 'A-2912', status: 'AVAILABLE' as any, vehicleType: 'Neonatal Transport Unit' },
    { ambulanceNumber: 'AMB-704', plateNumber: 'A-2913', status: 'AVAILABLE' as any, vehicleType: 'Critical Care Transport' },
    { ambulanceNumber: 'AMB-805', plateNumber: 'A-3015', status: 'AVAILABLE' as any, vehicleType: 'Standard Rescue' },
    { ambulanceNumber: 'AMB-806', plateNumber: 'A-3016', status: 'AVAILABLE' as any, vehicleType: 'Standard Rescue' }
  ];

  for (const a of ambulanceData) {
    try {
      await prisma.ambulance.create({
        data: a
      });
    } catch (e) {
      await prisma.ambulance.update({
        where: { ambulanceNumber: a.ambulanceNumber },
        data: { status: 'AVAILABLE' as any }
      });
    }
  }
  console.log('✔ Specialized Ambulances seeded.');

  console.log('--- Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
