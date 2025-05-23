import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Candidature } from 'src/candidature/candidature.entity';
import { Categorie } from 'src/categorie/categorie.entity';
import { Client } from 'src/client/client.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Admin {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  mdp: string;
}