import { Module } from '@nestjs/common';
import { CandidatureService } from './candidature.service';
import { CandidatureResolver } from './candidature.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { Offer } from 'src/offre/offer.entity';
import { Candidature } from './candidature.entity';
import { Experience } from 'src/experience/experience.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidature, Freelancer, Offer,Experience])],
  providers: [CandidatureService, CandidatureResolver]
})
export class CandidatureModule {}
