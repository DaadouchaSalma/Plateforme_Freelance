import { Module } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { FreelancerResolver } from './freelancer.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from './freelancer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Freelancer])],
  providers: [FreelancerService, FreelancerResolver]
})
export class FreelancerModule {}
