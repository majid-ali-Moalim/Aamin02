import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  create(createReportDto: any) {
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: string) {
    return `This action returns a #${id} report`;
  }

  update(id: string, updateReportDto: any) {
    return `This action updates a #${id} report`;
  }

  remove(id: string) {
    return `This action removes a #${id} report`;
  }
}
