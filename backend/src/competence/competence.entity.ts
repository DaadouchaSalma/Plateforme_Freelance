import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FreelancerCompetence } from 'src/freelancer-competence/freelancer-competence.entity';
import { Offer } from 'src/offre/offer.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  
  @ManyToMany(() => Offer, offer => offer.competences)
  offers: Offer[];
  
}