
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const patients = await prisma.patient.findMany({
    take: 5,
    select: { id: true, fullName: true, patientCode: true }
  })
  console.log(JSON.stringify(patients, null, 2))
  await prisma.$disconnect()
}

main()
