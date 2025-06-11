import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { FreelancerModule } from './freelancer/freelancer.module';
import { ClientModule } from './client/client.module';
import { OffreModule } from './offre/offre.module';
import { CandidatureModule } from './candidature/candidature.module';
import { CompetenceModule } from './competence/competence.module';
import { CategorieModule } from './categorie/categorie.module';
import { FeedbackModule } from './feedback/feedback.module';
import { LienProfModule } from './lien-prof/lien-prof.module';
import { FreelancerCompetenceModule } from './freelancer-competence/freelancer-competence.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { ExperienceModule } from './experience/experience.module';
import { ExperienceModule } from './experience/experience.module';
import { StatsModule } from './stat/stat.module';
// import { UploadScalar } from './common/scalars/upload.scalar';
import { MessagesModule } from './messages/messages.module';


@Module({
  imports: [TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'jobnest',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  }),
  GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  // csrfPrevention: false,
  playground: true,
  context: ({ req, res }) => ({ req, res }),
  }),
  FreelancerModule,
  ClientModule,
  OffreModule,
  CandidatureModule,
  CompetenceModule,
  CategorieModule,
  FeedbackModule,
  LienProfModule,
  FreelancerCompetenceModule,
  UserModule,
  AuthModule,
  ExperienceModule,
  MessagesModule,
  StatsModule,

],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
