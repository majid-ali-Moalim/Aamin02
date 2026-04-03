import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmployeesModule } from './employees/employees.module';
import { PatientsModule } from './patients/patients.module';
import { AmbulancesModule } from './ambulances/ambulances.module';
import { EmergencyRequestsModule } from './emergency-requests/emergency-requests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SystemSetupModule } from './system-setup/system-setup.module';
import { ReportsModule } from './reports/reports.module';
import { DriversModule } from './drivers/drivers.module';
import { NursesModule } from './nurses/nurses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
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
    DriversModule,
    NursesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
