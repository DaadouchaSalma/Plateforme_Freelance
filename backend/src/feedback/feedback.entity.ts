import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Client } from 'src/client/client.entity';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Feedback  {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  rating: number;

  @Field()
  @Column()
  comment: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Freelancer, { nullable: true })
  senderfreelancer?: Freelancer;

  @ManyToOne(() => Client, { nullable: true })
  senderClient?: Client;

  // Who received the feedback (can be a user or a client)
  @ManyToOne(() => Freelancer, { nullable: true })
  receiverfreelancer?: Freelancer;

  @ManyToOne(() => Client, { nullable: true })
  receiverClient?: Client;
}