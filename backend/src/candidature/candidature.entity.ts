import { Field, Float, ObjectType } from '@nestjs/graphql';
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
  dateApplication: Date;

  @ManyToOne(() => Freelancer, freelancer => freelancer.candidatures)
  freelancer: Freelancer;

  @ManyToOne(() => Offer, offer => offer.candidatures)
  offer: Offer;
}