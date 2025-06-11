import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CompetenceService } from './competence.service';
import { Competence } from './competence.entity';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Resolver()
export class CompetenceResolver {
    constructor(private readonly competenceService: CompetenceService) {}

    @Mutation(() => Competence)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async createCompetence(@Args('nom') nom: string): Promise<Competence> {
        return this.competenceService.createCompetence(nom);
  }
  @Query(() => [Competence])
  async getCompetences(): Promise<Competence[]> {
    return this.competenceService.getAllCompetences();
  }
}