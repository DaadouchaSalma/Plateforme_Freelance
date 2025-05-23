import { Module } from '@nestjs/common';
import { LienProfService } from './lien-prof.service';
import { LienProfResolver } from './lien-prof.resolver';

@Module({
  providers: [LienProfService, LienProfResolver]
})
export class LienProfModule {}
