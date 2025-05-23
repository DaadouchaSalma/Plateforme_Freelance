import { Module } from '@nestjs/common';
import { FreelancerCompetenceService } from './freelancer-competence.service';
import { FreelancerCompetenceResolver } from './freelancer-competence.resolver';

@Module({
  providers: [FreelancerCompetenceService, FreelancerCompetenceResolver]
})
export class FreelancerCompetenceModule {}
