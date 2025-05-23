import { Module } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CategorieResolver } from './categorie.resolver';

@Module({
  providers: [CategorieService, CategorieResolver]
})
export class CategorieModule {}
