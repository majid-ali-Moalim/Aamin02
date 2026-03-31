import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { PatientsModule } from './patients/patients.module';
import { AmbulancesModule } from './ambulances/ambulances.module';
import { EmergencyRequestsModule } from './emergency-requests/emergency-requests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SystemSetupModule } from './system-setup/system-setup.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    EmployeesModule,
    PatientsModule,
    AmbulancesModule,
    EmergencyRequestsModule,
    NotificationsModule,
    SystemSetupModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
