import { Module } from '@nestjs/common';
import { FreelancerCompetenceService } from './freelancer-competence.service';
import { FreelancerCompetenceResolver } from './freelancer-competence.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LienProfService } from 'src/lien-prof/lien-prof.service';
import { FreelancerCompetence } from './freelancer-competence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FreelancerCompetence])],
  providers: [FreelancerCompetenceService, FreelancerCompetenceResolver],
  exports: [FreelancerCompetenceService],
})
export class FreelancerCompetenceModule {}
