import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FreelancerCompetence } from 'src/freelancer-competence/freelancer-competence.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Competence {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  nom: string;

  @OneToMany(() => FreelancerCompetence, uc => uc.competence)
  FreelancerCompetences: FreelancerCompetence[];
}