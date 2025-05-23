import { Test, TestingModule } from '@nestjs/testing';
import { CategorieResolver } from './categorie.resolver';

describe('CategorieResolver', () => {
  let resolver: CategorieResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategorieResolver],
    }).compile();

    resolver = module.get<CategorieResolver>(CategorieResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
