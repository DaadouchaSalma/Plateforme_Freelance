import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Competence } from './competence.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompetenceService {
    constructor(
    @InjectRepository(Competence)
    private competenceRepository: Repository<Competence>,
  ) {}
  async createCompetence(nom: string): Promise<Competence> {
    const competence = this.competenceRepository.create({ nom });
    return await this.competenceRepository.save(competence);
  }

  async getAllCompetences(): Promise<Competence[]> {
    return await this.competenceRepository.find();
  }
}
