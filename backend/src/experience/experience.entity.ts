import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { Candidature } from 'src/candidature/candidature.entity';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { Offer } from 'src/offre/offer.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@ObjectType()
@Entity()
export class Experience {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  nomSociete: string;

  @Field()
  @Column()
  nomProjet: string;

  @Field()
  @Column()
  dateDebut: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dateFin?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => Candidature)
  @ManyToOne(() => Candidature, candidature => candidature.experiences)
  candidature: Candidature;
}
