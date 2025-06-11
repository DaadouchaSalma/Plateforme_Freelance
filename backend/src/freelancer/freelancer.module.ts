import { Module } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { FreelancerResolver } from './freelancer.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from './freelancer.entity';
import { Competence } from 'src/competence/competence.entity';
import { FreelancerCompetence } from 'src/freelancer-competence/freelancer-competence.entity';
import { LienProf } from 'src/lien-prof/lien-prof.entity';
import { CompetenceService } from 'src/competence/competence.service';
import { FreelancerCompetenceService } from 'src/freelancer-competence/freelancer-competence.service';
import { LienProfService } from 'src/lien-prof/lien-prof.service';
import { LienProfModule } from 'src/lien-prof/lien-prof.module';
import { CompetenceModule } from 'src/competence/competence.module';
import { FreelancerCompetenceModule } from 'src/freelancer-competence/freelancer-competence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Freelancer, FreelancerCompetence, Competence, LienProf]), 
    CompetenceModule, 
    FreelancerCompetenceModule,
    LienProfModule,
  ],
  providers: [FreelancerService, FreelancerResolver],
  exports: [FreelancerService],
})
export class FreelancerModule {}
