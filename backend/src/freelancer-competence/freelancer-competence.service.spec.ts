import { Test, TestingModule } from '@nestjs/testing';
import { FreelancerCompetenceService } from './freelancer-competence.service';

describe('FreelancerCompetenceService', () => {
  let service: FreelancerCompetenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreelancerCompetenceService],
    }).compile();

    service = module.get<FreelancerCompetenceService>(FreelancerCompetenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
