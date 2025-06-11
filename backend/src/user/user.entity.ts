import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Client } from "src/client/client.entity";
import { Freelancer } from "src/freelancer/freelancer.entity";
import { Message } from "src/messages/messages.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @Field(() => Freelancer, { nullable: true })
  @OneToOne(() => Freelancer, (freelancer) => freelancer.user, { nullable: true })
  freelancer: Freelancer;

 @Field(() => Client, { nullable: true })
  @OneToOne(() => Client, (client) => client.user, { nullable: true })
  client: Client;

@OneToMany(() => Message, (msg) => msg.sender)
sentMessages: Message[];

@OneToMany(() => Message, (msg) => msg.receiver)
receivedMessages: Message[];
}
