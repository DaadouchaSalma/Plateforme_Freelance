import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategorieService } from './categorie.service';
import { Categorie } from './categorie.entity';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Resolver()
export class CategorieResolver {
    constructor(private readonly categorieService: CategorieService) {}

    @Query(() => [Categorie])   
  async getAllCategories(): Promise<Categorie[]> {
    return this.categorieService.findAll();
  }

  @Mutation(() => Categorie)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createCategorie(
    @Args('title') title: string,
  ): Promise<Categorie> {
    return this.categorieService.create(title);
  }

}
