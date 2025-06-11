import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Candidature } from './candidature.entity';
import { CandidatureService } from './candidature.service';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
// import { Experience } from 'src/experience/experience.entity';
import { MinimalCandidatureInput } from './candidature.input';

@Resolver()
export class CandidatureResolver {
    constructor(private readonly candidatureService: CandidatureService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('FREELANCER')
  // @Mutation(() => Candidature)
  // async createCandidature(
  //   @Args('motivation') motivation: string,
  //   @Args('statut') statut: string,
  //   @Args('dateApplication') dateApplication: Date,
  //   @Args('offerId') offerId: number,
  //   @CurrentUser() user: User,
  // ): Promise<Candidature> {
  //   return this.candidatureService.createCandidature({
  //     motivation,
  //     statut,
  //     dateApplication,
  //     freelancerId:user.id,
  //     offerId,
  //   });
  // }

 @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FREELANCER')
  @Query(() => [Candidature])
  async myCandidatures(@CurrentUser() user: User): Promise<Candidature[]> {
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }
    return this.candidatureService.getCandidaturesByFreelancerId(user.id);
  }

   @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @Query(() => [Candidature], { name: 'candidaturesByOffre' })
async getCandidaturesByOffre(@Args('offreId', { type: () => Int }) offreId: number): Promise<Candidature[]> {
  return this.candidatureService.getCandidaturesByOffreId(offreId);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
@Mutation(() => Candidature)
async updateStatutCandidature(
  @Args('candidatureId', { type: () => Int }) candidatureId: number,
  @Args('statut', { type: () => String }) statut: string,
): Promise<Candidature> {
  return this.candidatureService.updateStatut(candidatureId, statut);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
@Mutation(() => Candidature)
  async accepterCandidature(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Candidature> {
    return this.candidatureService.accepterCandidature(id);
  }
  
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
  @Mutation(() => Candidature)
  async rejeterCandidature(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Candidature> {
    return this.candidatureService.rejeterCandidature(id);
  }



@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('FREELANCER')
@Mutation(() => Candidature)
async createCandidature(
  @Args('input') input: MinimalCandidatureInput,
  @CurrentUser() user: User,
): Promise<Candidature> {
  return this.candidatureService.createCandidature({
    ...input,
    freelancerId: user.id,  
  });
}



}
