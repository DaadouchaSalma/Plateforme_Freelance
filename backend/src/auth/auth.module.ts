import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Client } from 'src/client/client.entity';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { UserService } from 'src/user/user.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Competence } from 'src/competence/competence.entity';
import { LienProf } from 'src/lien-prof/lien-prof.entity';
import { FreelancerCompetence } from 'src/freelancer-competence/freelancer-competence.entity';


@Module({
    imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
    TypeOrmModule.forFeature([User, Client, Freelancer,Competence,LienProf,FreelancerCompetence]),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, UserService],
})
export class AuthModule {}
