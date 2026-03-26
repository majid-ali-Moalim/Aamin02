import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('patients')
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles('ADMIN', 'DISPATCHER')
  @ApiOperation({ summary: 'Create a new patient' })
  create(@Body() createPatientDto: any) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @Roles('ADMIN', 'DISPATCHER')
  @ApiOperation({ summary: 'Get all patients' })
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DISPATCHER', 'PATIENT')
  @ApiOperation({ summary: 'Get patient by ID' })
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DISPATCHER', 'PATIENT')
  @ApiOperation({ summary: 'Update patient' })
  update(@Param('id') id: string, @Body() updatePatientDto: any) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete patient' })
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}
