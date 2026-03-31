import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const identifier = 'aamin@admin';
  const password = '123321@admin';
  
  console.log(`--- Diagnostics for ${identifier} ---`);
  
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: identifier },
        { email: identifier }
      ]
    }
  });
  
  if (!user) {
    console.error('ERROR: User not found in database.');
    return;
  }
  
  console.log('User found:', {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    passwordHash: user.passwordHash
  });
  
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  console.log('Bcrypt match result:', isMatch);
  
  if (!isMatch) {
    console.log('Recalculating hash to check...');
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash generated:', newHash);
    const isNewMatch = await bcrypt.compare(password, newHash);
    console.log('New hash match result:', isNewMatch);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
