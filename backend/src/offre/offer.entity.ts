import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Candidature } from 'src/candidature/candidature.entity';
import { Categorie } from 'src/categorie/categorie.entity';
import { Client } from 'src/client/client.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Offer {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field(type => Float)
  @Column('float')
  budget: number;

  @Field()
  @Column({ type: 'date' })
  startDate: Date;

  @Field()
  @Column({ type: 'date' })
  endDate: Date;

  @Field()
  @Column()
  status: string;

  @ManyToOne(() => Client, client => client.offers)
  client: Client;

  @ManyToOne(() => Categorie, categorie => categorie.offres)
  categorie: Categorie;

  @OneToMany(() => Candidature, c => c.offer)
  candidatures: Candidature[];
}