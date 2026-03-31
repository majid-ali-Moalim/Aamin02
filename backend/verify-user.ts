import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: 'aamin@admin' },
        { email: 'aamin@admin' }
      ]
    }
  });
  
  if (user) {
    console.log('SUCCESS: Admin user found in database.');
    console.log('Username:', user.username);
    console.log('Email:', user.email);
  } else {
    console.error('FAILURE: Admin user NOT found in database.');
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
