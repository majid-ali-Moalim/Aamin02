
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ambulanceCount = await prisma.ambulance.count();
  const employeeCount = await prisma.employee.count();
  const patientCount = await prisma.patient.count();
  const requestCount = await prisma.emergencyRequest.count();
  const userCount = await prisma.user.count();
  const referralCount = await prisma.referral.count();
  const roles = await prisma.employeeRole.findMany();

  console.log({
    ambulanceCount,
    employeeCount,
    patientCount,
    requestCount,
    userCount,
    referralCount,
    roles: roles.map(r => r.name)
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
