import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Competence } from 'src/competence/competence.entity';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class FreelancerCompetence {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  niveau: string;

  @ManyToOne(() => Freelancer, freelancer => freelancer.FreelancerCompetences)
  freelancer: Freelancer;

  @ManyToOne(() => Competence, competence => competence.FreelancerCompetences)
  competence: Competence;
}