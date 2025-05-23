import { Test, TestingModule } from '@nestjs/testing';
import { CandidatureResolver } from './candidature.resolver';

describe('CandidatureResolver', () => {
  let resolver: CandidatureResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidatureResolver],
    }).compile();

    resolver = module.get<CandidatureResolver>(CandidatureResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
