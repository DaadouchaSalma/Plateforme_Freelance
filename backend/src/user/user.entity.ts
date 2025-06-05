import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Client } from "src/client/client.entity";
import { Freelancer } from "src/freelancer/freelancer.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

/*export enum UserRole {
FREELANCER = 'FREELANCER',
CLIENT = 'CLIENT',
ADMIN = 'ADMIN',
}*/

@Entity()
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column({ unique: true })
  email: string;
  @Field()
  @Column()
  password: string;
  @Field()
  /*@Column({ type: 'enum', enum: UserRole })
 role: UserRole;*/
 @Column()
  role: string;


  @OneToOne(() => Freelancer, (freelancer) => freelancer.user, { nullable: true })
  freelancer: Freelancer;

  @OneToOne(() => Client, (client) => client.user, { nullable: true })
  client: Client;
}
