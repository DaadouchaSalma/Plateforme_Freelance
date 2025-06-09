import {  UseGuards } from '@nestjs/common';
import { Context, Query } from '@nestjs/graphql';
import { Args, Float, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Offer } from './offer.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/user.entity';
import { OffreService } from './offre.service';

@Resolver()
export class OffreResolver {
    constructor(private readonly offerService: OffreService) {}

  @Mutation(() => Offer)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  async createOffer(
    @Args('title') title: string,
    @Args('description') description: string,
    @Args({ name: 'budget', type: () => Float }) budget: number,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
    @Args('status') status: string,
    @Args({ name: 'competenceIds', type: () => [Int] }) competenceIds: number[],
    @Args({ name: 'categorieId', type: () => Int }) categorieId: number,
    @CurrentUser() user: User,
  ): Promise<Offer> {
    return this.offerService.createOffer({
      title,
      description,
      budget,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      userId: user.id, 
      competenceIds,
      categorieId,
    });
  }
  @Mutation(() => Offer)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
async updateOffer(
  @Args('id', { type: () => Int }) id: number,
  @Args('title', { nullable: true }) title?: string,
  @Args('description', { nullable: true }) description?: string,
  @Args('budget', { type: () => Int, nullable: true }) budget?: number,
  @Args('startDate', { nullable: true }) startDate?: Date,
  @Args('endDate', { nullable: true }) endDate?: Date,
  @Args('status', { nullable: true }) status?: string,
  @Args('categorieId', { type: () => Int, nullable: true }) categorieId?: number,
): Promise<Offer> {
  return this.offerService.updateOffer(
    id,
    title,
    description,
    budget,
    startDate,
    endDate,
    status,
    categorieId,
  );
}
@Query(() => Offer)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
async getOfferById(
  @Args('id', { type: () => Int }) id: number,
): Promise<Offer> {
  return this.offerService.getOfferById(id);
}

@Query(() => [Offer])
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('FREELANCER')
async offers(): Promise<Offer[]> {
  return this.offerService.getAllOffersForFreelancer();
}

@Query(() => [Offer])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  async offersForClient(@Context() context): Promise<Offer[]> {
    const userId = context.req.user.id;
    return this.offerService.getAllOffersForClient(userId);
  }

@Mutation(() => Boolean)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
async deleteOffer(
  @Args('offerId', { type: () => Int }) offerId: number,
  @CurrentUser() user: any,
): Promise<boolean> {
  return this.offerService.deleteOfferByClient(offerId, user.id);
}

}

