import { Module } from '@nestjs/common';
import { CandidatureService } from './candidature.service';
import { CandidatureResolver } from './candidature.resolver';

@Module({
  providers: [CandidatureService, CandidatureResolver]
})
export class CandidatureModule {}
