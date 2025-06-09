import { Module } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CategorieResolver } from './categorie.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categorie } from './categorie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categorie])],
  providers: [CategorieService, CategorieResolver]
})
export class CategorieModule {}
