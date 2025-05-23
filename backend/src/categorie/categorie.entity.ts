import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Client } from 'src/client/client.entity';
import { Offer } from 'src/offre/offer.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Categorie {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  title: string;

  @OneToMany(() => Offer, offer => offer.categorie)
  offres: Offer[];
}