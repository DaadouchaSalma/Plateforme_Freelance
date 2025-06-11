import { Module } from '@nestjs/common';
import { CompetenceService } from './competence.service';
import { CompetenceResolver } from './competence.resolver';
import { Competence } from './competence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Competence])],
  providers: [CompetenceResolver, CompetenceService],
})
export class CompetenceModule {}
