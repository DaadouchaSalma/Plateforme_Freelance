import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Freelancer } from './freelancer.entity';
import { FreelancerService } from './freelancer.service';

@Resolver()
export class FreelancerResolver {
    constructor(private readonly freelancerService: FreelancerService) {}

  @Query(() => [Freelancer])
  async allFreelancers(): Promise<Freelancer[]> {
    return this.freelancerService.findAll();
  }
  @Query(() => Freelancer, { nullable: true })
  async freelancerById(@Args('id', { type: () => Int }) id: number): Promise<Freelancer | null> {
    return this.freelancerService.findOneById(id);
  }
   @Mutation(() => Freelancer)
  async updateFreelancer(
    @Args('id', { type: () => Int }) id: number,
    @Args('nom', { nullable: true }) nom?: string,
    @Args('prenom', { nullable: true }) prenom?: string,
    @Args('photo', { nullable: true }) photo?: string,
    @Args('bio', { nullable: true }) bio?: string,
    @Args('disponibilite', { nullable: true }) disponibilite?: boolean,
  ): Promise<Freelancer> {
    const freelancer = await this.freelancerService.findOneById(id);

    if (!freelancer) {
      throw new Error('Freelancer not found');
    }

    // mise à jour des champs conditionnellement
    if (nom !== undefined) freelancer.nom = nom;
    if (prenom !== undefined) freelancer.prenom = prenom;
    if (photo !== undefined) freelancer.photo = photo;
    if (bio !== undefined) freelancer.bio = bio;
    if (disponibilite !== undefined) freelancer.disponibilite = disponibilite;

    return this.freelancerService.save(freelancer);
  }
}
