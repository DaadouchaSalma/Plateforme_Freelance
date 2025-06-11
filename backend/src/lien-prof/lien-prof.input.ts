import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class LienProfInput {
  @Field(() => Int, { nullable: true })
  id: number; 

  @Field()
  type: string;

  @Field()
  url: string;
}