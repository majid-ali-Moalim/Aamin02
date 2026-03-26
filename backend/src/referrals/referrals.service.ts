import { Injectable } from '@nestjs/common';

@Injectable()
export class ReferralsService {
  create(createReferralDto: any) {
    return 'This action adds a new referral';
  }

  findAll() {
    return `This action returns all referrals`;
  }

  findOne(id: string) {
    return `This action returns a #${id} referral`;
  }

  update(id: string, updateReferralDto: any) {
    return `This action updates a #${id} referral`;
  }

  remove(id: string) {
    return `This action removes a #${id} referral`;
  }
}
