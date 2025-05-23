import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class LienProf {
  @Field(type => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  url: string;

  @ManyToOne(() => Freelancer, freelancer => freelancer.liens)
  @JoinColumn()
  freelancer: Freelancer;
}