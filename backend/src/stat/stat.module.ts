import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidature } from 'src/candidature/candidature.entity';
import { Offer } from 'src/offre/offer.entity';
import { User } from 'src/user/user.entity';
import { StatsResolver } from './stat.resolver';
import { FreelancerCompetence } from 'src/freelancer-competence/freelancer-competence.entity';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { Client } from 'src/client/client.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([User, Offer, Candidature,FreelancerCompetence,Freelancer,Client]),
       
    ],
    providers: [StatsResolver],
})
export class StatsModule {}