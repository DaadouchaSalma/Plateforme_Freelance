import { Module } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { FreelancerResolver } from './freelancer.resolver';

@Module({
  providers: [FreelancerService, FreelancerResolver]
})
export class FreelancerModule {}
