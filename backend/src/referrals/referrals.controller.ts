import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  create(@Body() createReferralDto: any) {
    return this.referralsService.create(createReferralDto);
  }

  @Get()
  findAll() {
    return this.referralsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referralsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateReferralDto: any) {
    return this.referralsService.update(id, updateReferralDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referralsService.remove(id);
  }
}
