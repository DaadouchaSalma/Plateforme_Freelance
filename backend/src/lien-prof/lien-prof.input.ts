import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LienProfInput {
  @Field()
  type: string;

  @Field()
  url: string;
}
