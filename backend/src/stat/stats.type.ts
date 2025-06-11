import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Stats {
  @Field(() => Int)
  clients: number;

  @Field(() => Int)
  freelancers: number;

  @Field(() => Int)
  activeOffers: number;

  @Field(() => Int)
  candidatures: number;
}
