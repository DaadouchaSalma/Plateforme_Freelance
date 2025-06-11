import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CategorieStats {
  @Field()
  categorie: string;

  @Field(() => Int)
  nombre: number;
}