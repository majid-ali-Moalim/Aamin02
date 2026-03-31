import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  // Clear Master Data tables
  const results = await Promise.all([
    prisma.department.deleteMany({}),
    prisma.employeeRole.deleteMany({}),
    prisma.equipmentLevel.deleteMany({}),
    prisma.incidentCategory.deleteMany({}),
  ]);
  
  console.log('Cleanup complete:');
  console.log(`- Departments: ${results[0].count}`);
  console.log(`- Employee Roles: ${results[1].count}`);
  console.log(`- Equipment Levels: ${results[2].count}`);
  console.log(`- Incident Categories: ${results[3].count}`);
}
main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
