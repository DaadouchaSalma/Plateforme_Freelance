import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Candidature } from 'src/candidature/candidature.entity';
import { Feedback } from 'src/feedback/feedback.entity';
import { FreelancerCompetence } from 'src/freelancer-competence/freelancer-competence.entity';
import { LienProf } from 'src/lien-prof/lien-prof.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';


@ObjectType()
@Entity()
export class Freelancer {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @Field()
  @Column()
  nom: string;

  @Field()
  @Column()
  prenom: string;

  @Field()
  @Column()
  photo: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  disponibilite?: boolean;

  @Field(() => [FreelancerCompetence])
  @OneToMany(() => FreelancerCompetence, uc => uc.freelancer)
  FreelancerCompetences: FreelancerCompetence[];

  
  @Field(() => [LienProf])
  @OneToMany(() => LienProf, lien => lien.freelancer)
  liens: LienProf[];
  
  
  @Field(() => Candidature)
  @OneToMany(() => Candidature, c => c.freelancer)
  candidatures: Candidature[];

  
  @Field(() => Feedback)
  @OneToMany(() => Feedback, feedback => feedback.senderfreelancer)
  sentFeedbacks: Feedback[];

  
  @Field(() => Feedback)
  @OneToMany(() => Feedback, feedback => feedback.receiverfreelancer)
  receivedFeedbacks: Feedback[];
  
  @Field(() => User)
  @OneToOne(() => User, (user) => user.freelancer, { cascade: true })
  @JoinColumn()
  user: User;
}