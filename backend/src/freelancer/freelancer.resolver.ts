import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Freelancer } from './freelancer.entity';
import { FreelancerService } from './freelancer.service';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/user.entity';

@Resolver()
export class FreelancerResolver {
    constructor(private readonly freelancerService: FreelancerService) {}

  @Query(() => [Freelancer])
  async allFreelancers(): Promise<Freelancer[]> {
    return this.freelancerService.findAll();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @Query(() => Freelancer, { nullable: true })
  async freelancerById(@Args('id', { type: () => Int }) id: number): Promise<Freelancer | null> {
    return this.freelancerService.findOneById(id);
  }
  
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('FREELANCER')
   @Mutation(() => Freelancer)
  async updateFreelancer(
    @CurrentUser() user: User,
    @Args('nom', { nullable: true }) nom?: string,
    @Args('prenom', { nullable: true }) prenom?: string,
    @Args('photo', { nullable: true }) photo?: string,
    @Args('bio', { nullable: true }) bio?: string,
    @Args('disponibilite', { nullable: true }) disponibilite?: boolean,
  ): Promise<Freelancer> {
    const freelancer = await this.freelancerService.findByUserId(user.id);


    if (!freelancer) {
    throw new Error('Freelancer not found');
  }

  if (user.role !== 'FREELANCER') {
    throw new Error('Not authorized to update this freelancer');
  }

    if (nom !== undefined) freelancer.nom = nom;
    if (prenom !== undefined) freelancer.prenom = prenom;
    if (photo !== undefined) freelancer.photo = photo;
    if (bio !== undefined) freelancer.bio = bio;
    if (disponibilite !== undefined) freelancer.disponibilite = disponibilite;

    return this.freelancerService.save(freelancer);
  }
  @UseGuards(JwtAuthGuard)
    @Query(() => Freelancer, { name: 'meFreelancer', nullable: true })
    async getCurrentFreelancer(@CurrentUser() user: User): Promise<Freelancer | null> {
        const freelancer = await this.freelancerService.findByUserId(user.id);
        return freelancer;
    }
}
