import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Freelancer } from './freelancer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FreelancerService {
    
    constructor(
    @InjectRepository(Freelancer)
    private readonly freelancerRepository: Repository<Freelancer>,
  ) {}

  async findAll(): Promise<Freelancer[]> {
    return this.freelancerRepository.find({ relations: ['user','FreelancerCompetences','candidatures','FreelancerCompetences.competence','liens'] });
  }
  

  async findOneById(id: number): Promise<Freelancer|null> {
    return this.freelancerRepository.findOne({
    where: { id },
    relations: ['user','FreelancerCompetences','candidatures','FreelancerCompetences.competence','liens'],
  });
}
async save(freelancer: Freelancer): Promise<Freelancer> {
  return this.freelancerRepository.save(freelancer);
}

async findByUserId(userId: number): Promise<Freelancer | null> {
  return this.freelancerRepository.findOne({
    where: { user: { id: userId } },
    relations: ['user','FreelancerCompetences','candidatures','FreelancerCompetences.competence','liens'],
  });
}
}
