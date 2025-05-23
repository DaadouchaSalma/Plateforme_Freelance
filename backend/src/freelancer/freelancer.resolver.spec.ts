import { Test, TestingModule } from '@nestjs/testing';
import { FreelancerResolver } from './freelancer.resolver';

describe('FreelancerResolver', () => {
  let resolver: FreelancerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreelancerResolver],
    }).compile();

    resolver = module.get<FreelancerResolver>(FreelancerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
