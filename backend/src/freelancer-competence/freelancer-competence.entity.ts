import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Competence } from 'src/competence/competence.entity';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class FreelancerCompetence {
  @Field(type => Int,{ nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column()
  niveau: string;

  @Field(() => Freelancer)
  @ManyToOne(() => Freelancer, freelancer => freelancer.FreelancerCompetences)
  freelancer: Freelancer;

  @Field(() => Competence)
  @ManyToOne(() => Competence, competence => competence.FreelancerCompetences)
  competence: Competence;
}