import { Module } from '@nestjs/common';
import { OffreService } from './offre.service';
import { OffreResolver } from './offre.resolver';
import { Offer } from './offer.entity';
import { Client } from 'src/client/client.entity';
import { Categorie } from 'src/categorie/categorie.entity';
import { Candidature } from 'src/candidature/candidature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competence } from 'src/competence/competence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Client, Categorie, Candidature,Competence])],
  providers: [OffreService, OffreResolver],
  exports: [OffreService],
})
export class OffreModule {}
