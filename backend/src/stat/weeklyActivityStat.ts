import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class WeeklyActivityStat {
  @Field()
  day: string; 

  @Field()
  offers: number;

  @Field()
  candidatures: number;
}