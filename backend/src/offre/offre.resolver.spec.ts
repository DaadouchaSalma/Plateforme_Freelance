import { Test, TestingModule } from '@nestjs/testing';
import { OffreResolver } from './offre.resolver';

describe('OffreResolver', () => {
  let resolver: OffreResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffreResolver],
    }).compile();

    resolver = module.get<OffreResolver>(OffreResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
