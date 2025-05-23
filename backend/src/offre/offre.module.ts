import { Module } from '@nestjs/common';
import { OffreService } from './offre.service';
import { OffreResolver } from './offre.resolver';

@Module({
  providers: [OffreService, OffreResolver]
})
export class OffreModule {}
