import { Test, TestingModule } from '@nestjs/testing';
import { LienProfResolver } from './lien-prof.resolver';

describe('LienProfResolver', () => {
  let resolver: LienProfResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LienProfResolver],
    }).compile();

    resolver = module.get<LienProfResolver>(LienProfResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
