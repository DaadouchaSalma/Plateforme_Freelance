import { Module } from '@nestjs/common';
import { LienProfService } from './lien-prof.service';
import { LienProfResolver } from './lien-prof.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LienProf } from './lien-prof.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LienProf])],
  providers: [LienProfService, LienProfResolver],
  exports: [LienProfService],
})
export class LienProfModule {}
