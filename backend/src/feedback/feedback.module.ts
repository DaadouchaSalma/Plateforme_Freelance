import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackResolver } from './feedback.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/client/client.entity';
import { Freelancer } from 'src/freelancer/freelancer.entity';
import { Feedback } from './feedback.entity';
import { ClientModule } from 'src/client/client.module';
import { FreelancerModule } from 'src/freelancer/freelancer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback, Client, Freelancer]),
    FreelancerModule, 
    ClientModule,
  ],
  providers: [FeedbackService, FeedbackResolver]
})
export class FeedbackModule {}
