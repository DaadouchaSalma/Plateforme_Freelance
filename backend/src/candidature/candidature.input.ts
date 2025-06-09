import { InputType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { ExperienceInput } from 'src/experience/experience.input';

@InputType()
export class MinimalCandidatureInput {
  @Field()
  motivation: string;

  @Field()
  statut: string;

  @Field()
  dateApplication: string; 

//   @Field(() => Int)
//   freelancerId?: number;

  @Field(() => Int)
  offerId: number;

  @Field(() => [ExperienceInput], { nullable: true })
  experiences?: ExperienceInput[];
}
