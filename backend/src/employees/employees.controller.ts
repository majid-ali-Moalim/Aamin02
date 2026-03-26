import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EmployeeType } from '@prisma/client';

@ApiTags('employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new employee' })
  create(@Body() createEmployeeDto: any) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Roles('ADMIN', 'DISPATCHER')
  @ApiOperation({ summary: 'Get all employees' })
  findAll(@Query('employeeType') employeeType?: string) {
    if (employeeType && !Object.values(EmployeeType).includes(employeeType as EmployeeType)) {
      throw new BadRequestException(`Invalid employeeType. Must be one of: ${Object.values(EmployeeType).join(', ')}`);
    }
    return this.employeesService.findAll(employeeType as EmployeeType);
  }

  @Get(':id')
  @Roles('ADMIN', 'DISPATCHER')
  @ApiOperation({ summary: 'Get employee by ID' })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update employee' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: any) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete employee' })
  remove(@Param('id') id: string) {
    return this.employeesService.delete(id);
  }
}
