import { Test, TestingModule } from '@nestjs/testing';
import { CompetenceResolver } from './competence.resolver';

describe('CompetenceResolver', () => {
  let resolver: CompetenceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetenceResolver],
    }).compile();

    resolver = module.get<CompetenceResolver>(CompetenceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
