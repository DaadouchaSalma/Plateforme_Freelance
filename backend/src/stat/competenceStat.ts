import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class CompetenceStat {
  @Field()
  nom: string;

  @Field()
  count: number;

  @Field(() => Float)
  percentage: number;
}
