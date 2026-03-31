import { Module } from '@nestjs/common';
import { SystemSetupService } from './system-setup.service';
import { SystemSetupController } from './system-setup.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SystemSetupService],
  controllers: [SystemSetupController],
  exports: [SystemSetupService],
})
export class SystemSetupModule {}
