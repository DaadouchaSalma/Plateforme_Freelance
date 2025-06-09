import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categorie } from './categorie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategorieService {
    constructor(
    @InjectRepository(Categorie)
    private categorieRepository: Repository<Categorie>,
  ) {}

  async create(title: string): Promise<Categorie> {
    const newCategorie = this.categorieRepository.create({ title });
    return this.categorieRepository.save(newCategorie);
  }
  async findAll(): Promise<Categorie[]> {
    return this.categorieRepository.find({ relations: ['offres'] });
  }
}
