import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Candidature } from 'src/candidature/candidature.entity';
import { Feedback } from 'src/feedback/feedback.entity';
import { FreelancerCompetence } from 'src/freelancer-competence/freelancer-competence.entity';
import { LienProf } from 'src/lien-prof/lien-prof.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Freelancer {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  nom: string;

  @Field()
  @Column()
  prenom: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  mdp: string;

  @Field()
  @Column()
  photo: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  disponibilite?: boolean;

  @OneToMany(() => FreelancerCompetence, uc => uc.freelancer)
  FreelancerCompetences: FreelancerCompetence[];

  @OneToMany(() => LienProf, lien => lien.freelancer)
  liens: LienProf[];

  @OneToMany(() => Candidature, c => c.freelancer)
  candidatures: Candidature[];

  @OneToMany(() => Feedback, feedback => feedback.senderfreelancer)
  sentFeedbacks: Feedback[];

  @OneToMany(() => Feedback, feedback => feedback.receiverfreelancer)
  receivedFeedbacks: Feedback[];
}