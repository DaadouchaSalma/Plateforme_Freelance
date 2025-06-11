import { ObjectType, Field, Int } from '@nestjs/graphql';
@ObjectType()
export class DomaineStat {
  @Field()
  domaine: string;

  @Field()
  totalClients: number;
}