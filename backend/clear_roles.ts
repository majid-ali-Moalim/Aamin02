import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.employeeRole.deleteMany({});
  console.log('All employee roles deleted.');
}
main();
