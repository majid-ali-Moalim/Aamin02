import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { UploadsController } from './uploads.controller';

@Module({
  controllers: [EmployeesController, UploadsController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
