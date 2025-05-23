import { Test, TestingModule } from '@nestjs/testing';
import { LienProfService } from './lien-prof.service';

describe('LienProfService', () => {
  let service: LienProfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LienProfService],
    }).compile();

    service = module.get<LienProfService>(LienProfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
