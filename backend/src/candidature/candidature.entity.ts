import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { Experience } from 'src/experience/experience.entity';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { Offer } from 'src/offre/offer.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Candidature {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  motivation: string;

  @Field()
  @Column()
  statut: string;

  @Field()
  @Column()
  dateApplication: string;

  @Field(() => Freelancer)
  @ManyToOne(() => Freelancer, freelancer => freelancer.candidatures)
  freelancer: Freelancer;

  @Field(() => Offer)
  @ManyToOne(() => Offer, offer => offer.candidatures)
  offer: Offer;

  @Field(() => [Experience], { nullable: true })
  @OneToMany(() => Experience, experience => experience.candidature, { cascade: true })
  experiences?: Experience[];
}