import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Feedback } from 'src/feedback/feedback.entity';
import { Offer } from 'src/offre/offer.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Client  {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Field()
  @Column()
  nom: string;

  @Field()
  @Column()
  photo: string;

  @Field()
  @Column({ type: 'text' })
  about: string;

  @Field()
  @Column()
  adresse: string;

  @Field()
  @Column()
  codePostal: string;

  @Field()
  @Column()
  tel: string;

  @Field()
  @Column()
  siteweb: string;

  @Field()
  @Column()
  domaine: string;

  @OneToMany(() => Offer, offer => offer.client)
  offers: Offer[];

  @OneToMany(() => Feedback, feedback => feedback.senderClient)
  sentFeedbacks: Feedback[];

  @OneToMany(() => Feedback, feedback => feedback.receiverClient)
  receivedFeedbacks: Feedback[];

  @Field(() => User)
  @OneToOne(() => User, (user) => user.client)
  @JoinColumn()
  user: User;
}

