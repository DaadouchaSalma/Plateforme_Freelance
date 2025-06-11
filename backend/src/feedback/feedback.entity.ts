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

  @Field(() => Freelancer, { nullable: true })
  @ManyToOne(() => Freelancer, { nullable: true })
  senderfreelancer?: Freelancer;

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, { nullable: true })
  senderClient?: Client;

  @Field(() => Freelancer, { nullable: true })
  @ManyToOne(() => Freelancer, { nullable: true })
  receiverfreelancer?: Freelancer;

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, { nullable: true })
  receiverClient?: Client;
}