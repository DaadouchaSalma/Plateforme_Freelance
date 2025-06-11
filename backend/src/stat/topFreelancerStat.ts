import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TopFreelancerStat {
  @Field()
  nom: string;

  @Field()
  prenom: string;

  @Field()
  photo: string;

  @Field(() => Int)
  nombre: number;
}