import { Test, TestingModule } from '@nestjs/testing';
import { FreelancerCompetenceResolver } from './freelancer-competence.resolver';

describe('FreelancerCompetenceResolver', () => {
  let resolver: FreelancerCompetenceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreelancerCompetenceResolver],
    }).compile();

    resolver = module.get<FreelancerCompetenceResolver>(FreelancerCompetenceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
