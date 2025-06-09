import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class ExperienceInput {
  @Field()
  nomSociete: string;

  @Field()
  nomProjet: string;

  @Field()
  dateDebut: string;  

  @Field({ nullable: true })
  dateFin?: string;

  @Field({ nullable: true })
  description?: string;
}
