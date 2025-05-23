import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Feedback } from 'src/feedback/feedback.entity';
import { Offer } from 'src/offre/offer.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Client {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  nom: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  mdp: string;

  @Field()
  @Column()
  photo: string;

  @OneToMany(() => Offer, offer => offer.client)
  offers: Offer[];

  @OneToMany(() => Feedback, feedback => feedback.senderClient)
  sentFeedbacks: Feedback[];

  @OneToMany(() => Feedback, feedback => feedback.receiverClient)
  receivedFeedbacks: Feedback[];
}

